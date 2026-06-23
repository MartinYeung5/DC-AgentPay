import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      evmVersion: "paris"   // 兼容 Injective EVM，避免 mcopy / push0 等新指令
    }
  },
  networks: {
    injectiveTestnet: {
      url: "https://k8s.testnet.json-rpc.injective.network/",
      chainId: 1439,
      accounts: process.env.DEPLOYER_PK ? [process.env.DEPLOYER_PK] : []
    },
    injectiveMainnet: {
      url: "https://sentry.evm-rpc.injective.network/",
      chainId: 2525,
      accounts: process.env.DEPLOYER_PK ? [process.env.DEPLOYER_PK] : []
    }
  }
};
export default config;
