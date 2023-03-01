import { startBrowser } from './startBrowser';
import { scrapeAll } from './pageController';

//Start the browser and create a browser instance
const browserInstance = startBrowser();

// Pass the browser instance to the scraper controller
scrapeAll(browserInstance);
