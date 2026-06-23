// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title PaymentProxy —— 托管式支付代理（含 Gas 代付）
contract PaymentProxy is Ownable {
    mapping(address => mapping(address => uint256)) public allowances; // user => token => limit
    mapping(address => bool) public relayers;

    event Authorized(address indexed user, address indexed token, uint256 amount);
    event ProxyPaid(address indexed user, address indexed token, address indexed to, uint256 amount);

    constructor() Ownable(msg.sender) {}

    modifier onlyRelayer() {
        require(relayers[msg.sender], "Not relayer");
        _;
    }

    function setRelayer(address r, bool ok) external onlyOwner { relayers[r] = ok; }

    function authorize(address token, uint256 amount) external {
        allowances[msg.sender][token] = amount;
        emit Authorized(msg.sender, token, amount);
    }

    /// @notice Relayer 代付 Gas 并执行 ERC20 转账
    function proxyPay(address user, address token, address to, uint256 amount)
        external onlyRelayer
    {
        require(allowances[user][token] >= amount, "Exceed limit");
        allowances[user][token] -= amount;
        require(IERC20(token).transferFrom(user, to, amount), "transfer fail");
        emit ProxyPaid(user, token, to, amount);
    }
}
