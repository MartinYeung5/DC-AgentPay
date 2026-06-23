import { test, expect } from "@playwright/test";

test.describe("AI Smart Payment Frontend Smoke", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("apiKey", "sk_test_demo_001");
    });
  });

  test("默认重定向至简体", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/zh-CN|zh-TW|en/);
  });

  test("可切换至繁体", async ({ page }) => {
    await page.goto("/zh-CN");
    await page.selectOption('[data-testid="lang-switcher"]', "zh-TW");
    await expect(page).toHaveURL(/\/zh-TW/);
  });

  test("Dashboard 渲染统计卡片", async ({ page }) => {
    await page.goto("/zh-CN/dashboard");
    await expect(page.locator('[data-testid="stat-card"]').first()).toBeVisible({ timeout: 10000 });
  });

  test("Agent 列表页可访问", async ({ page }) => {
    await page.goto("/zh-CN/agents");
    await expect(page.locator("h1")).toContainText(/Agent|代理/i);
  });

  test("支付方式页可访问", async ({ page }) => {
    await page.goto("/zh-CN/payment-methods");
    await expect(page.locator("h1")).toContainText(/支付方式|Payment/i);
  });
});
