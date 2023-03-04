import { Browser, Page } from 'puppeteer';
import { lei_mostra_articulado } from './constants';
import { lawPagePromise } from './lawPage';

export const scraperObject = {
  async getLinks(page: Page): Promise<string[]> {
    // Get all a href links
    const newHrefs: string[] = await page.$$eval('a', (as) =>
      as.map((a) => a.href)
    );

    // FILTER ALL THAT CONTAIN 'lei_mostra_articulado'
    const filteredHrefs = newHrefs.filter((href) =>
      href.includes(lei_mostra_articulado)
    );
    return filteredHrefs;
  },
  async getNextPage(page: Page): Promise<string[] | null> {
    // get next page (a href element with img inside)
    const links = await page.$$eval('a', (ahrefs) => {
      const nextSrc = 'https://www.pgdlisboa.pt/imagens/bt_avancar.gif';
      const links = ahrefs.map((a) => {
        const img = a.querySelector('img');
        if (img && img.src === nextSrc) {
          return a.href;
        }
        return null;
      });
      return links;
    });
    const nextPage = links.filter(
      (link) => link !== null && link.includes('ficha=')
    );
    return nextPage;
  },
  async scraper(url: string, browser: Browser) {
    let page: Page = await browser.newPage();
    let hrefs: string[] = [];
    let nextPageUrl: string | null = null;
    console.log(`Navigating to ${url}...`);
    // Navigate to the selected page
    await page.goto(url);
    // Wait for the required DOM to be rendered
    await page.waitForSelector('#lei-busca');

    do {
      if (nextPageUrl) {
        page = await browser.newPage();
        await page.goto(nextPageUrl);
      }
      // Get all a href links
      const newHrefs: string[] = await this.getLinks(page);

      hrefs = [...hrefs, ...newHrefs];

      // get next page (a href element with img inside)
      const nextPageUrls: string[] = await this.getNextPage(page);

      nextPageUrl = nextPageUrls[0];
      console.log('nextPageUrl: ', nextPageUrl);
      // if nextPageUrl is undefined or null then break
      if (nextPageUrl === null || nextPageUrl === undefined) {
        break;
      }
    } while (nextPageUrl !== null || nextPageUrl !== undefined);

    // hrefs.forEach(async (link) => {
    //   // console.log('link ', link);
    //   let currentPageData = await lawPagePromise(link, browser);
    //   console.log('currentPageData: ', currentPageData);
    // });

    // just one page to test
    const first = hrefs[0];
    let currentPageData = await lawPagePromise(first, browser);
    console.log('cu: ', currentPageData);

    page.close();
  },
};
