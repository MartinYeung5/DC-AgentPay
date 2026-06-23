.PHONY: install seed test test-contracts test-backend test-sdk test-frontend test-all coverage clean

install:
	cd contracts && npm install
	cd backend   && npm install
	cd sdk       && npm install
	cd frontend  && npm install
	cd mcp-server && npm install

seed:
	cd backend && npm run prisma:deploy && npm run prisma:seed

test-contracts:
	cd contracts && npm run test

test-backend:
	cd backend && npm run test:unit

test-sdk:
	cd sdk && npm test

test-frontend:
	cd frontend && npx playwright test

test-all: test-contracts test-backend test-sdk
	@echo "✅ All unit & integration tests passed!"

coverage:
	cd contracts && npm run coverage
	cd backend   && npm run test:coverage
	cd sdk       && npm run test:coverage

clean:
	rm -rf */node_modules */dist */.next */coverage
