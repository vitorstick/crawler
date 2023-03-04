import puppeteer, { Browser } from 'puppeteer';

export const startBrowser = async () => {
  const browser: Browser = await puppeteer.launch({
    headless: false,
    args: ['--disable-setuid-sandbox'],
    ignoreHTTPSErrors: true,
  });

  return browser;
};
