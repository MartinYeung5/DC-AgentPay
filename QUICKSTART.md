# 🚀 快速启动 + 测试指南

## 一、首次启动

```bash
# 0. 复制环境变量
cp .env.example .env
# 编辑 .env, 填入 DEEPSEEK_API_KEY、HD_MNEMONIC、DEPLOYER_PK

# 1. 一键安装所有子项目依赖
make install

# 2. 启动 Postgres + Redis
docker compose up -d postgres redis

# 3. 数据库迁移 + 假数据
make seed
# ↑ 会创建 1 个 demo 租户、5 个 Agent、30 笔支付、4 种支付方式
# 默认 API Key: sk_test_demo_001

# 4. 启动后端
cd backend && npm run start:dev

# 5. 新终端启动前端
cd frontend && npm run dev

# 6. 浏览器打开 http://localhost:3000
```

## 二、合约部署（可选，已默认走 mock）

```bash
cd contracts
npm run compile
npm run deploy:testnet
# 把输出的合约地址填入 backend/.env
```

## 三、运行所有自动化测试

```bash
# 在项目根目录
make test-all        # 单元测试合集
make coverage        # 覆盖率报告

# 单独运行某层
make test-contracts  # Hardhat + Chai
make test-backend    # Jest
make test-sdk        # Vitest + MSW
cd frontend && npm run test:e2e   # Playwright
```

## 四、CI/CD

代码推送到 GitHub 后自动触发 `.github/workflows/ci.yml`：
- ✅ contracts: 编译 + 测试
- ✅ backend: 单元测试
- ✅ sdk: Vitest

## 五、常见操作

```bash
# 查看后端日志
cd backend && npm run start:dev

# 重置数据库 + 重新 seed
docker compose down -v
docker compose up -d postgres
make seed

# 进入前端测试 UI 模式
cd frontend && npm run test:e2e:ui
```
