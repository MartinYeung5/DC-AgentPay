# DC AgentPay

基于 Injective 区块链构建的去中心化 AI 支付即服务协议。

## ✨ 核心亮点

- 🎨 **UI设计**：玻璃拟态 + 渐变品牌色，桌面级专业体验
- 💳 **多支付方式**：Web3 钱包 / Stripe / 支付宝 / 微信 / 银行转账，用户可自行配置
- 🤖 **Agent 全生命周期管理**：创建、编辑、暂停、删除一应俱全
- 📊 **实时控制台**：统计卡片、7 日趋势图、近期支付流水
- 🧪 **完整自动化测试**：合约 + 后端 + SDK + E2E + CI/CD

## 📁 项目结构

```
ai-smart-payment/
├── contracts/          # Solidity 智能合约（Hardhat + 自动化测试）
├── backend/            # NestJS API（含 Seed 脚本与 Jest 单测）
├── sdk/                # @ai-pay/sdk（Vitest + MSW 测试）
├── mcp-server/         # MCP 工具服务器
├── frontend/           # Next.js 14（蓝色专业 UI + Playwright E2E）
├── .github/workflows/  # GitHub Actions CI
├── Makefile            # 一键命令集合
└── docker-compose.yml
```

## 🚀 快速启动（含假数据）

```bash
# 1. 安装所有依赖
make install

# 2. 启动数据库
docker compose up -d postgres redis

# 3. 迁移 + 注入假数据
make seed

# 4. 启动后端
cd backend && npm run start:dev &

# 5. 启动前端
cd frontend && npm run dev

# 6. 访问 http://localhost:3000

```

## 🧪 运行自动化测试

```bash
make test-all      # 合约 + 后端 + SDK 单测
make coverage      # 生成覆盖率报告
cd frontend && npm run test:e2e   # 前端 E2E
```

## 📷 页面一览

| 页面 | 路径 | 功能 |
|------|------|------|
| 控制台 | `/zh-CN/dashboard` | 4 张统计卡 + 7 日趋势 + 近期流水 |
| Agent 管理 | `/zh-CN/agents` | CRUD + 暂停/激活 + 卡片视图 |
| 支付记录 | `/zh-CN/payments` | 全量交易表格 |
| 订阅管理 | `/zh-CN/subscriptions` | 订阅卡片 + 下次扣款时间 |
| 支付方式 | `/zh-CN/payment-methods` | 5 类支付渠道动态配置 |
| 管理员定价 | `/zh-CN/admin/pricing` | 套餐 + DeepSeek Token 单价 |

## 📜 License

MIT
