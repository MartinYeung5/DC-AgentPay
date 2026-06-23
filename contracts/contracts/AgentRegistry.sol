// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title AgentRegistry —— ERC-8004 风格的灵魂绑定 Agent 身份
contract AgentRegistry is ERC721, Ownable {
    struct AgentMeta {
        string did;
        string serviceEndpoint;
        string metadataURI;
        address owner;
        uint256 createdAt;
        bool active;
    }

    uint256 private _nextId = 1;
    mapping(uint256 => AgentMeta) public agents;
    mapping(string => uint256) public didToId;
    mapping(address => uint256) public ownerToId;

    event AgentRegistered(uint256 indexed agentId, address indexed owner, string did);
    event AgentUpdated(uint256 indexed agentId, string metadataURI);

    constructor() ERC721("AI Payment Agent", "AIPA") Ownable(msg.sender) {}

    function registerAgent(
        string calldata did,
        string calldata endpoint,
        string calldata metadataURI
    ) external returns (uint256) {
        require(didToId[did] == 0, "DID exists");
        require(ownerToId[msg.sender] == 0, "Already registered");

        uint256 id = _nextId++;
        _safeMint(msg.sender, id);
        agents[id] = AgentMeta(did, endpoint, metadataURI, msg.sender, block.timestamp, true);
        didToId[did] = id;
        ownerToId[msg.sender] = id;

        emit AgentRegistered(id, msg.sender, did);
        return id;
    }

    function updateMetadata(uint256 id, string calldata uri) external {
        require(agents[id].owner == msg.sender, "Not owner");
        agents[id].metadataURI = uri;
        emit AgentUpdated(id, uri);
    }

    /// @dev SBT —— 禁止转移
    function _update(address to, uint256 tokenId, address auth)
        internal override returns (address)
    {
        address from = _ownerOf(tokenId);
        require(from == address(0) || to == address(0), "Soulbound");
        return super._update(to, tokenId, auth);
    }
}
