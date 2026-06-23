// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract AgentWallet is AccessControl, ReentrancyGuard {
    bytes32 public constant OPERATOR  = keccak256("OPERATOR");
    bytes32 public constant TREASURER = keccak256("TREASURER");
    bytes32 public constant VIEWER    = keccak256("VIEWER");

    struct Rule {
        uint256 dailyLimit;
        uint256 perTxLimit;
        uint32  maxTxPerDay;
    }
    mapping(address => Rule) public tokenRules;
    mapping(address => bool) public whitelist;
    mapping(uint256 => uint256) public dailySpent;
    mapping(uint256 => uint32)  public dailyCount;
    bool public whitelistEnabled;

    event Paid(address indexed token, address indexed to, uint256 amount, bytes32 ref);
    event RuleUpdated(address indexed token, uint256 daily, uint256 perTx, uint32 cnt);

    constructor(address owner) {
        _grantRole(DEFAULT_ADMIN_ROLE, owner);
        _grantRole(TREASURER, owner);
        _grantRole(OPERATOR, owner);
    }

    receive() external payable {}

    function setRule(address token, uint256 daily, uint256 perTx, uint32 cnt)
        external onlyRole(TREASURER)
    {
        tokenRules[token] = Rule(daily, perTx, cnt);
        emit RuleUpdated(token, daily, perTx, cnt);
    }

    function setWhitelist(address to, bool ok) external onlyRole(TREASURER) {
        whitelist[to] = ok;
    }

    function toggleWhitelist(bool on) external onlyRole(TREASURER) {
        whitelistEnabled = on;
    }

    function pay(address token, address to, uint256 amount, bytes32 ref)
        external onlyRole(OPERATOR) nonReentrant
    {
        if (whitelistEnabled) require(whitelist[to], "Not whitelisted");

        Rule memory r = tokenRules[token];
        require(r.perTxLimit == 0 || amount <= r.perTxLimit, "Per-tx limit");

        uint256 day = block.timestamp / 1 days;
        require(r.maxTxPerDay == 0 || dailyCount[day] < r.maxTxPerDay, "Daily cnt");
        require(r.dailyLimit == 0 || dailySpent[day] + amount <= r.dailyLimit, "Daily limit");

        dailySpent[day] += amount;
        dailyCount[day] += 1;

        if (token == address(0)) {
            (bool ok, ) = to.call{value: amount}("");
            require(ok, "ETH transfer failed");
        } else {
            require(IERC20(token).transfer(to, amount), "ERC20 transfer failed");
        }
        emit Paid(token, to, amount, ref);
    }
}
