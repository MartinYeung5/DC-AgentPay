import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  console.log("Balance :", (await ethers.provider.getBalance(deployer.address)).toString());

  const Registry = await ethers.deployContract("AgentRegistry");
  await Registry.waitForDeployment();
  console.log("AgentRegistry      :", await Registry.getAddress());

  const Sub = await ethers.deployContract("SubscriptionManager");
  await Sub.waitForDeployment();
  console.log("SubscriptionManager:", await Sub.getAddress());

  const Batch = await ethers.deployContract("BatchSettlement");
  await Batch.waitForDeployment();
  console.log("BatchSettlement    :", await Batch.getAddress());

  const Proxy = await ethers.deployContract("PaymentProxy");
  await Proxy.waitForDeployment();
  console.log("PaymentProxy       :", await Proxy.getAddress());

  console.log("\n>>> Save these addresses to backend/.env <<<");
}
main().catch(e => { console.error(e); process.exit(1); });
