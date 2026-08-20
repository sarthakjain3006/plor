import { mkdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const port = 4173;
const baseUrl = `http://127.0.0.1:${port}`;
const outputDir = "outputs/screenshots";

await mkdir(outputDir, { recursive: true });

const server = spawn("npm", ["run", "dev", "--", "--host", "127.0.0.1", "--port", String(port)], {
  detached: true,
  stdio: ["ignore", "pipe", "pipe"],
  env: { ...process.env, WRANGLER_LOG_PATH: "/tmp/from-to-chat-wrangler.log" },
});

const waitForServer = async () => {
  const deadline = Date.now() + 45_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // The dev server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error("Timed out waiting for the dev server");
};

try {
  await waitForServer();
  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || undefined,
    });
  } catch (error) {
    throw new Error(
      `Unable to launch Chromium. Install Playwright browser dependencies with ` +
      `\"npx playwright install --with-deps chromium\" or set PLAYWRIGHT_EXECUTABLE_PATH.\n${error}`,
    );
  }
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.screenshot({ path: `${outputDir}/01-conversation.png`, fullPage: true });

  await page.getByRole("button", { name: "Draw operation" }).click();
  await page.getByRole("region", { name: "Agent operation drawing" }).waitFor();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${outputDir}/02-operation-canvas.png`, fullPage: true });

  await page.locator(".react-flow__node").first().click();
  await page.waitForTimeout(250);
  await page.screenshot({ path: `${outputDir}/03-selected-node.png`, fullPage: true });

  const colorButtons = page.locator(".operation-color-options .color-option");
  await colorButtons.nth(1).click();
  await page.screenshot({ path: `${outputDir}/04-color-option.png`, fullPage: true });

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  await mobile.goto(baseUrl, { waitUntil: "networkidle" });
  await mobile.getByRole("button", { name: "Draw operation" }).click();
  await mobile.getByRole("region", { name: "Agent operation drawing" }).waitFor();
  await mobile.waitForTimeout(1200);
  await mobile.screenshot({ path: `${outputDir}/05-mobile-operation-canvas.png`, fullPage: true });

  await mobile.close();
  await browser.close();
  console.log(`Screenshots written to ${outputDir}`);
} finally {
  try {
    process.kill(-server.pid, "SIGTERM");
  } catch {
    server.kill("SIGTERM");
  }
}
