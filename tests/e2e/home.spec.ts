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

  test("English homepage exposes Bing-friendly metadata and image alt text", async ({ page }) => {
    await page.goto("/en");

    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute(
      "content",
      "MIST Architects is a Shenzhen architecture studio working across cultural spaces, interiors, adaptive reuse, and public architecture."
    );

    const description = await metaDescription.getAttribute("content");
    expect(description?.length ?? 0).toBeLessThanOrEqual(160);
    await expect(page.locator('.hero-media[alt=""]')).toHaveCount(0);
    await expect(page.locator(".hero-media").first()).toHaveAttribute(
      "alt",
      /MIST Architects project photograph/
    );
  });
});

test.describe("about contact interactions", () => {
  test("Chinese about page exposes the approved search summary wording", async ({ page }) => {
    await page.goto("/zh/about#intro");

    const description =
      "岚·建筑设计是一家立足深圳的建筑事务所，关注建筑、室内、城市更新、公共文化与商业空间设计，由程博、李博共同创立。官网收录项目作品、团队介绍、媒体经历、联系方式与微信公众号 MIST-ARCH。";

    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      description
    );
    await expect(page.locator("#intro")).toContainText(description);
  });

  test("WeChat public account opens the QR code dialog", async ({ page }) => {
    await page.goto("/en/about#contact");

    const metaDescription = page.locator('meta[name="description"]');
    const descriptionText =
      "MIST Architects is a Shenzhen studio for architecture, interiors, adaptive reuse, public cultural and commercial spaces, founded by Cheng Bo and Li Bo.";

    await expect(metaDescription).toHaveAttribute(
      "content",
      descriptionText
    );
    const description = await metaDescription.getAttribute("content");
    expect(description?.length ?? 0).toBeLessThanOrEqual(155);
    await expect(page.locator("#intro")).toContainText(descriptionText);
    await expect(page.locator("#intro")).toContainText("WeChat MIST-ARCH");

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
    expect(structuredData).toContain("hasOfferCatalog");
    expect(structuredData).toContain("Public and cultural architecture");
    expect(structuredData).toContain("areaServed");
    expect(structuredData).toContain("Founder");

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

test.describe("GEO machine-readable surfaces", () => {
  test("root llms.txt exposes canonical AI context", async ({ request }) => {
    const response = await request.get("/llms.txt");

    expect(response.ok()).toBeTruthy();
    expect(response.headers()["content-type"]).toContain("text/plain");

    const body = await response.text();
    expect(body).toContain("# MIST Architects");
    expect(body).toContain("https://mist-arch.com/zh");
    expect(body).toContain("https://mist-arch.com/en/projects/field-academy");
    expect(body).toContain("OAI-SearchBot");
    expect(body).toContain("Do not infer unpublished project facts");
  });

  test("project JSON-LD exposes GEO citation facts", async ({ page }) => {
    await page.goto("/en/projects/field-academy#project-white-detail");

    const structuredData = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((nodes) => nodes.map((node) => node.textContent ?? "").join("\n"));

    expect(structuredData).toContain("contentLocation");
    expect(structuredData).toContain("creditText");
    expect(structuredData).toContain("2,000 sqm");
    expect(structuredData).toContain("Xingye Cultural Tourism");
    expect(structuredData).toContain("Plan relationships");
    expect(structuredData).toContain("01-overview-panorama.jpg");
  });

  test("project index JSON-LD exposes the archive as an item list", async ({ page }) => {
    await page.goto("/en/projects");

    const structuredData = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((nodes) => nodes.map((node) => node.textContent ?? "").join("\n"));

    expect(structuredData).toContain("project-index");
    expect(structuredData).toContain("ItemList");
    expect(structuredData).toContain("WILD WORKSHOP");
    expect(structuredData).toContain("Bambu Lab First Store");
    expect(structuredData).toContain("/en/projects/field-academy");
  });

  test("journal JSON-LD exposes entries as blog posts", async ({ page }) => {
    await page.goto("/en/journal#bilingual-architecture-records");

    const structuredData = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((nodes) => nodes.map((node) => node.textContent ?? "").join("\n"));

    expect(structuredData).toContain("journal-index");
    expect(structuredData).toContain("BlogPosting");
    expect(structuredData).toContain("Architectural Records across Chinese and English");
    expect(structuredData).toContain("/en/journal#bilingual-architecture-records");
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
