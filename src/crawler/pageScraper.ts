import { Browser } from 'puppeteer';
import { lei_mostra_articulado } from './constants';
import { lawPagePromise } from './lawPage';

export const scraperObject = {
  url: 'https://www.pgdlisboa.pt/leis/lei_main.php?ficha={0}',
  async scraper(browser: Browser) {
    let page = await browser.newPage();
    console.log(`Navigating to ${this.url}...`);
    // Navigate to the selected page
    await page.goto(this.url);
    // Wait for the required DOM to be rendered
    await page.waitForSelector('#lei-busca');

    // Get all a href links
    const hrefs: string[] = await page.$$eval('a', (as) =>
      as.map((a) => a.href)
    );

    // get next page (a href with img inside)
    // const nextPage = await page.$eval('a > img', (img) => {
    //   console(img);
    // });
    // console.log('nextPage: ', nextPage);

    // FILTER ALL THAT CONTAIN 'lei_mostra_articulado'
    const filteredHrefs = hrefs.filter((href) =>
      href.includes(lei_mostra_articulado)
    );

    // filteredHrefs.forEach(async (link) => {
    //   // console.log('link ', link);
    //   let currentPageData = await lawPagePromise(link, browser);
    //   console.log('currentPageData: ', currentPageData);
    // });

    // just one page to test
    const first = filteredHrefs[0];
    let currentPageData = await lawPagePromise(first, browser);
    console.log('cu: ', currentPageData);

    page.close();
  },
};
