// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SubscriptionManager {
    struct Plan {
        address merchant;
        address token;
        uint256 amount;
        uint256 period;
        bool active;
        string  metaURI;
    }
    struct Sub {
        uint256 planId;
        address subscriber;
        uint256 nextCharge;
        bool active;
    }

    uint256 public planCount;
    uint256 public subCount;
    mapping(uint256 => Plan) public plans;
    mapping(uint256 => Sub)  public subs;

    event PlanCreated(uint256 indexed id, address indexed merchant);
    event Subscribed(uint256 indexed subId, address indexed user, uint256 planId);
    event Charged(uint256 indexed subId, uint256 amount, uint256 nextCharge);
    event Cancelled(uint256 indexed subId);

    function createPlan(address token, uint256 amount, uint256 period, string calldata uri)
        external returns (uint256)
    {
        uint256 id = ++planCount;
        plans[id] = Plan(msg.sender, token, amount, period, true, uri);
        emit PlanCreated(id, msg.sender);
        return id;
    }

    function subscribe(uint256 planId) external returns (uint256) {
        Plan memory p = plans[planId];
        require(p.active, "inactive plan");
        require(IERC20(p.token).transferFrom(msg.sender, p.merchant, p.amount), "pay fail");

        uint256 sid = ++subCount;
        subs[sid] = Sub(planId, msg.sender, block.timestamp + p.period, true);
        emit Subscribed(sid, msg.sender, planId);
        emit Charged(sid, p.amount, block.timestamp + p.period);
        return sid;
    }

    function charge(uint256 subId) external {
        Sub storage s = subs[subId];
        Plan memory p = plans[s.planId];
        require(s.active && block.timestamp >= s.nextCharge, "not due");
        require(IERC20(p.token).transferFrom(s.subscriber, p.merchant, p.amount), "pay fail");
        s.nextCharge = block.timestamp + p.period;
        emit Charged(subId, p.amount, s.nextCharge);
    }

    function cancel(uint256 subId) external {
        Sub storage s = subs[subId];
        require(s.subscriber == msg.sender, "not owner");
        s.active = false;
        emit Cancelled(subId);
    }
}
