import { startBrowser } from './startBrowser';
import { scrapeAll } from './pageController';
import { Browser } from 'puppeteer';

//Start the browser and create a browser instance
const browserInstance: Promise<Browser> = startBrowser();

// Pass the browser instance to the scraper controller
scrapeAll(browserInstance);
