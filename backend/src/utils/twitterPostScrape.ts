import puppeteer from "puppeteer-extra";
import StealthPlugins from "puppeteer-extra-plugin-stealth";
import * as cheerio from "cheerio";
import RandomUserAgent from "puppeteer-extra-plugin-anonymize-ua";
import UserAgent from "user-agents";
import { Page } from "puppeteer";
import { generateUserAgents } from "./generateRandomUserAgent.js";
// @ts-expect-error("type:module error")
puppeteer.use(StealthPlugins());
// @ts-expect-error("type:module error, it prefer commonjs")
puppeteer.use(
  // @ts-expect-error("type:module error, it prefer commonjs")
  RandomUserAgent({
    customFn: () => new UserAgent().random().toString(),
  })
);
async function coreLogic(page: Page, url: string) {
  await page.goto(url, { waitUntil: "networkidle2" });
  await new Promise((resolve) =>
    setTimeout(resolve, Math.floor(Math.random() * 3000) + 1000)
  );
  const content = await page.content();
  const $ = cheerio.load(content);
  const tweetText = $('div[data-testid="tweetText"]').text();
  const tweetUser = $('div[data-testid="User-Name"]').text();
  const tweetPhotos: Array<string> = [];
  $('div[data-testid="tweetPhoto"] > img').each((_, element) => {
    const photoUrl = $(element).attr("src");
    if (photoUrl) {
      tweetPhotos.push(photoUrl);
    }
  });
  const username_and_id = tweetUser.split("@");
  return {
    tweetUrl: url,
    username: username_and_id[0],
    twitterUsername: "@" + username_and_id[1],
    tweetText,
    tweetPhotos,
  };
}
export async function scrapTwitter(url: string, headless: boolean) {
  // @ts-expect-error("type:module error")
  const browser = await puppeteer.launch({
    headless: headless,
  });
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({
    "Accept-Language": "en-US,en;q=0.9",
    Referer: "https://www.google.com/",
  });
  await page.setViewport({
    width: Math.floor(Math.random() * (1920 - 1024)) + 1024,
    height: Math.floor(Math.random() * (1080 - 768)) + 768,
  });
  const generatedUserAgents = generateUserAgents(100);
  const randomUserAgent =
    generatedUserAgents[Math.floor(Math.random() * generatedUserAgents.length)];
  console.log("Random User-Agent:", randomUserAgent);
  await page.setUserAgent(randomUserAgent);
  await page.goto("https://httpbin.io/user-agent");
  const bodyText1 = await page.evaluate(() => {
    return document.body.innerText;
  });
  console.log(bodyText1);
  const returnScrapData = await coreLogic(page, url);
  await browser.close();
  return returnScrapData;
}
// (async () => {
//     const dataScrap = await scrapTwitter('https://x.com/juberti/status/1861123495897465273', true);
//     console.log({ dataScrap });
// })();
