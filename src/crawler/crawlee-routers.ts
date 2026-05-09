import { createPlaywrightRouter } from "crawlee";
import { expect } from "playwright/test";

export const router = createPlaywrightRouter();

router.addHandler("FACEBOOK_POST", async ({ page }) => {
  const postTitle = await page
    .locator('[role="dialog"] h2', { hasText: "פוסט של" })
    .innerText();
  const posterName = postTitle.replace("פוסט של ", "");

  const postDescription = (
    await page
      .locator('[role="dialog"] [data-ad-preview="message"]')
      .allInnerTexts()
  ).join();

  console.log(postDescription, posterName);
});

router.addDefaultHandler(async ({ page, request, enqueueLinks }) => {
  console.log("here!");
  await expect(page.getByText("שיתוף").first()).toBeVisible();

  const postLinksArr: string[] = [];

  const numberOfScrolls = 100;
  for (let i = 0; i < numberOfScrolls; i++) {
    const caughtLinks = await page
      .getByRole("feed")
      .locator("div:nth-child(n+2)")
      .evaluateAll((divs, passedUrl) => {
        // NOTE: Runs in the browser itself!
        console.log(passedUrl);
        return divs
          .map((div) => {
            const href = div
              .querySelector(`[href^="${passedUrl}"]`)
              ?.getAttribute("href");
            if (!href) return;

            const url = new URL(href);
            const goodURL = url.origin + url.pathname;

            return goodURL;
          })
          .filter((value) => !!value);
      }, request.url);
    postLinksArr.push(...(caughtLinks as string[]));

    await page.evaluate(() =>
      window.scrollBy({ top: document.body.scrollHeight, behavior: "smooth" }),
    );
    await page.waitForTimeout(300); // Add a delay to let new content load
  }

  const postLinksPure = [...new Set(postLinksArr)];
  console.log("postLinks:", postLinksPure);
  console.log(postLinksPure.length);

  await enqueueLinks({
    urls: postLinksPure,
    label: "FACEBOOK_POST",
  });
});
