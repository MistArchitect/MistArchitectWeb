import { expect, test } from "@playwright/test";

test.describe("localized homepage", () => {
  test("Chinese homepage renders the primary portfolio surface", async ({ page }) => {
    await page.goto("/zh");

    await expect(page).toHaveTitle(/岚·建筑设计|MIST Architects/);
    await expect(page.getByRole("banner")).toContainText("岚·建筑设计");
    await expect(page.getByRole("link", { name: "切换到英文" })).toBeVisible();
    await expect(page.getByRole("main")).toContainText("深圳 · 梦工场 · 青年实验剧场");
    await expect(page.locator("#projects")).toContainText("项目索引");
  });

  test("English homepage renders and links back to Chinese", async ({ page }) => {
    await page.goto("/en");

    await expect(page).toHaveTitle(/MIST Architects/);
    await expect(page.getByRole("banner")).toContainText("MIST Architects");
    await expect(page.getByRole("link", { name: "Switch to Chinese" })).toBeVisible();
    await expect(page.getByRole("main")).toContainText(
      "Shenzhen · Dream Factory · Experimental Theater"
    );
    await expect(page.locator("#projects")).toContainText("Project Index");
  });
});

test.describe("about contact interactions", () => {
  test("WeChat public account opens the QR code dialog", async ({ page }) => {
    await page.goto("/en/about#contact");

    const structuredData = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((nodes) => nodes.map((node) => node.textContent ?? "").join("\n"));

    expect(structuredData).toContain("WeChat public account");
    expect(structuredData).toContain("WeChat Official Account ID");
    expect(structuredData).toContain("MIST-ARCH (岚建筑设计)");
    expect(structuredData).toContain("AboutPage");
    expect(structuredData).toContain("ContactPage");
    expect(structuredData).toContain("MIST Architects WeChat public account MIST-ARCH QR code");
    expect(structuredData).toContain("/20260531-191007.jpeg");

    await page.getByRole("button", { name: "MIST-ARCH (岚建筑设计)" }).click();

    const dialog = page.getByRole("dialog", { name: "MIST-ARCH (岚建筑设计)" });
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole("img", { name: "MIST Architects WeChat public account MIST-ARCH QR code" })
    ).toBeVisible();

    await dialog.getByRole("button", { exact: true, name: "Close" }).click();
    await expect(dialog).toHaveCount(0);
  });
});

test.describe("project and journal detail states", () => {
  test("incomplete project detail uses the development fallback", async ({ page }) => {
    await page.goto("/en/projects/dream-factory-experimental-theater#project-development-status");

    await expect(page.getByRole("heading", { name: "Dream Factory Experimental Theater" })).toBeVisible();
    await expect(page.getByText("Project details are in development.")).toBeVisible();
    await expect(page.getByRole("link", { name: "Back to Project Index" })).toHaveAttribute(
      "href",
      "/en#projects"
    );
    await expect(page.locator("#project-white-detail")).toHaveCount(0);
    await expect(page.locator(".project-immersive-carousel")).toHaveAttribute(
      "data-static-image",
      "true"
    );
    await expect(page.locator(".project-immersive-slide")).toHaveCount(1);
  });

  test("field academy still renders the complete project detail", async ({ page }) => {
    await page.goto("/en/projects/field-academy#project-white-detail");

    await expect(page.locator(".project-data-grid")).toContainText("Location");
    await expect(page.locator("#drawings")).toContainText("Plan relationships");
    await expect(page.getByText("Project details are in development.")).toHaveCount(0);
  });

  test("field academy hero carousel advances with a fade transition", async ({ page }) => {
    await page.goto("/en/projects/field-academy#project-intro-text");

    const carousel = page.locator(".project-immersive-carousel");
    await expect(carousel).toHaveAttribute("data-slide-count", "4");
    await expect(carousel).not.toHaveAttribute("data-static-image", "true");

    const activeSlide = page.locator(".project-immersive-slide.is-active");
    const firstActiveSrc = await activeSlide.getAttribute("src");
    const transition = await page.locator(".project-immersive-slide").first().evaluate((slide) => {
      const style = window.getComputedStyle(slide);
      return `${style.transitionProperty} ${style.transitionDuration}`;
    });

    expect(transition).toContain("opacity");

    await page.waitForTimeout(5500);
    await expect(activeSlide).toHaveCount(1);
    await expect(activeSlide).not.toHaveAttribute("src", firstActiveSrc ?? "");
  });

  test("journal hash links target individual entries", async ({ page }) => {
    await page.goto("/en/journal#bilingual-architecture-records");

    const entry = page.locator("#bilingual-architecture-records");
    await expect(entry).toBeVisible();
    await expect(entry).toContainText("Architectural Records across Chinese and English");
  });
});
