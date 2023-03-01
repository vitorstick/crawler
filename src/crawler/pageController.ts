import { scraperObject } from './pageScraper';

export const scrapeAll = async (browserInstance) => {
  let browser;
  try {
    browser = await browserInstance;
    await scraperObject.scraper(browser);
  } catch (err) {
    console.log('Could not resolve the browser instance => ', err);
  }
};
