import { Browser } from 'puppeteer';
import { scraperObject } from './pageScraper';

export const scrapeAll = async (browserInstance: Promise<Browser>) => {
  let browser: Browser;
  try {
    browser = await browserInstance;
    await scraperObject.scraper(browser);
  } catch (err) {
    console.log('Could not resolve the browser instance => ', err);
    // finish process
    process.exit(1);
  }
};
