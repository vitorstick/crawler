import puppeteer from 'puppeteer';

export const startBrowser = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--disable-setuid-sandbox'],
    ignoreHTTPSErrors: true,
  });

  return browser;
};
