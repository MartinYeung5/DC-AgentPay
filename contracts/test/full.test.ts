import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("AI Smart Payment — Full Contract Suite", () => {
  async function deployFixture() {
    const [owner, alice, bob, merchant] = await ethers.getSigners();
    const registry = await ethers.deployContract("AgentRegistry");
    const sub      = await ethers.deployContract("SubscriptionManager");
    const batch    = await ethers.deployContract("BatchSettlement");
    const proxy    = await ethers.deployContract("PaymentProxy");
    const wallet   = await ethers.deployContract("AgentWallet", [owner.address]);
    const Mock     = await ethers.getContractFactory("MockERC20");
    const token    = await Mock.deploy("TST", "TST", ethers.parseEther("1000000"));
    return { registry, sub, batch, proxy, wallet, token, owner, alice, bob, merchant };
  }

  describe("AgentRegistry", () => {
    it("TC-C-1 注册并 mint SBT", async () => {
      const { registry, alice } = await loadFixture(deployFixture);
      await expect(registry.connect(alice).registerAgent("did:1", "ep", "uri"))
        .to.emit(registry, "AgentRegistered");
      expect(await registry.ownerOf(1)).to.equal(alice.address);
    });
    it("TC-C-2 SBT 不可转移", async () => {
      const { registry, alice, bob } = await loadFixture(deployFixture);
      await registry.connect(alice).registerAgent("did:2", "ep", "uri");
      await expect(registry.connect(alice).transferFrom(alice.address, bob.address, 1))
        .to.be.revertedWith("Soulbound");
    });
    it("TC-C-3 重复 DID 拒绝", async () => {
      const { registry, alice, owner } = await loadFixture(deployFixture);
      await registry.connect(alice).registerAgent("did:dup", "x", "y");
      await expect(registry.connect(owner).registerAgent("did:dup", "x", "y"))
        .to.be.revertedWith("DID exists");
    });
  });

  describe("AgentWallet 风控", () => {
    it("TC-C-4 单笔上限校验", async () => {
      const { wallet, token, bob } = await loadFixture(deployFixture);
      await token.transfer(await wallet.getAddress(), ethers.parseEther("100"));
      await wallet.setRule(await token.getAddress(),
        ethers.parseEther("50"), ethers.parseEther("10"), 100);
      await expect(
        wallet.pay(await token.getAddress(), bob.address,
          ethers.parseEther("20"), ethers.encodeBytes32String("r"))
      ).to.be.revertedWith("Per-tx limit");
    });
    it("TC-C-5 白名单拦截", async () => {
      const { wallet, token, bob } = await loadFixture(deployFixture);
      await wallet.toggleWhitelist(true);
      await expect(
        wallet.pay(await token.getAddress(), bob.address, 1, ethers.encodeBytes32String("r"))
      ).to.be.revertedWith("Not whitelisted");
    });
    it("TC-C-6 正常支付触发事件", async () => {
      const { wallet, token, bob } = await loadFixture(deployFixture);
      await token.transfer(await wallet.getAddress(), ethers.parseEther("100"));
      await expect(
        wallet.pay(await token.getAddress(), bob.address,
          ethers.parseEther("5"), ethers.encodeBytes32String("ok"))
      ).to.emit(wallet, "Paid");
      expect(await token.balanceOf(bob.address)).to.equal(ethers.parseEther("5"));
    });
  });

  describe("Subscription", () => {
    it("TC-C-7 完整订阅生命周期", async () => {
      const { sub, token, alice, merchant } = await loadFixture(deployFixture);
      await sub.connect(merchant).createPlan(await token.getAddress(), ethers.parseEther("10"), 60, "ipfs://");
      await token.transfer(alice.address, ethers.parseEther("1000"));
      await token.connect(alice).approve(await sub.getAddress(), ethers.parseEther("1000"));
      await sub.connect(alice).subscribe(1);
      expect((await sub.subs(1)).active).to.equal(true);
      await ethers.provider.send("evm_increaseTime", [61]);
      await ethers.provider.send("evm_mine", []);
      await sub.charge(1);
      await sub.connect(alice).cancel(1);
      expect((await sub.subs(1)).active).to.equal(false);
    });
  });

  describe("Batch Settlement", () => {
    it("TC-C-8 批量结算成功", async () => {
      const { batch, token, alice, bob, owner } = await loadFixture(deployFixture);
      await token.transfer(alice.address, ethers.parseEther("100"));
      await token.connect(alice).approve(await batch.getAddress(), ethers.parseEther("100"));
      const items = [
        { token: await token.getAddress(), from: alice.address, to: bob.address,   amount: ethers.parseEther("1") },
        { token: await token.getAddress(), from: alice.address, to: owner.address, amount: ethers.parseEther("2") }
      ];
      await expect(batch.executeBatch(items, ethers.encodeBytes32String("b1")))
        .to.emit(batch, "BatchExecuted").withArgs(2, ethers.encodeBytes32String("b1"));
    });
  });
});
