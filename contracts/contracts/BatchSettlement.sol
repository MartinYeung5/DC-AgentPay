// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BatchSettlement {
    event BatchExecuted(uint256 count, bytes32 batchId);

    struct Item { address token; address from; address to; uint256 amount; }

    function executeBatch(Item[] calldata items, bytes32 batchId) external {
        uint256 len = items.length;
        for (uint256 i; i < len; ++i) {
            Item calldata it = items[i];
            require(
                IERC20(it.token).transferFrom(it.from, it.to, it.amount),
                "batch item failed"
            );
        }
        emit BatchExecuted(len, batchId);
    }
}
