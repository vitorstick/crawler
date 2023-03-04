import { Browser } from 'puppeteer';

export interface article {
  title: string | null;
  body: string | null;
}

export interface chapter {
  title: string;
  articles?: article[];
}

export const lawPagePromise = (link: string, browser: Browser) =>
  new Promise(async (resolve, reject) => {
    let dataObj = {};
    let newPage = await browser.newPage();
    await newPage.goto(link);

    dataObj = await newPage.evaluate(() => {
      function getArticleFromTable(table: HTMLTableElement): article | null {
        let title = null;
        let body = null;
        const articleTitle = table.querySelector('.txt_base_b_l')?.textContent;
        // must contain the word 'artigo'
        if (articleTitle && articleTitle?.toLowerCase().includes('artigo')) {
          title = articleTitle;
        }
        const articleBody = table.querySelector('.txt_base_n_l');
        // if contains valign top property and text not empty
        if (articleBody) {
          body = articleBody.textContent;
        }

        if (title && body) {
          return { title, body };
        }
        return null;
      }

      function getSummary(table: HTMLTableElement) {
        let summary = table.textContent;
        if (summary) {
          summary = summary.replace('SUMÁRIO', '');
        }
        return summary;
      }

      function getChapter(table: HTMLTableElement) {
        // find td with class txt_11_b_l inside table and get text
        const td = table.querySelector('.txt_11_b_l');
        const chapter = td?.textContent;
        return chapter;
      }

      // GET NODE LIST OF TABLES
      const tables = document.querySelectorAll('table');
      // GET TABLE WITH 'SUMÁRIO' TEXT INSIDE
      let summary = null;
      let chapters: chapter[] = [];
      let articleList: article[] = [];
      tables.forEach((table) => {
        if (table.textContent.includes('SUMÁRIO')) {
          summary = getSummary(table);
        }

        if (table.textContent.includes('CAPÍTULO ')) {
          const chapterTitle = getChapter(table);
          if (chapterTitle) {
            const newChapter: chapter = {
              title: chapterTitle,
              articles: [],
            };
            // if not already in chapterList, push to chapters array
            const alreadyExist = chapters.find(
              (chapter) => chapter.title === chapterTitle
            );
            if (!alreadyExist) {
              chapters.push(newChapter);
            }
          }
        }

        // get last chapter
        const lastChapter = chapters[chapters.length - 1];
        if (lastChapter) {
          // get articles from table
          const article = getArticleFromTable(table);
          if (article) {
            // if article is already in articleList, replace it with the new one
            const alreadyExist = articleList?.find(
              (art) => art.title === article.title
            );
            if (alreadyExist) {
              const index = articleList.indexOf(alreadyExist);
              articleList[index] = article;
            } else {
              articleList.push(article);
            }

            const alreadyExistOnChapter = lastChapter.articles?.find(
              (art) => art.title === article.title
            );
            if (alreadyExistOnChapter) {
              const index = lastChapter.articles?.indexOf(
                alreadyExistOnChapter
              );
              lastChapter.articles[index] = article;
            } else {
              lastChapter.articles?.push(article);
            }
          }
        }
      });

      // get element with class descricaomodulos and get the text from first div
      const descricaomodulos = document.querySelector('.descricaomodulos');
      const process = descricaomodulos?.children[0].textContent;
      const title = descricaomodulos?.children[1].textContent;

      // to get text from all the elements with txt_base_n_l and without valign property
      let text = '';
      const textElements = document.querySelectorAll('.txt_base_n_l');
      textElements.forEach((element) => {
        if (!element.getAttribute('valign')) {
          text += element.textContent;
        }
      });

      return { summary, title, process, text, chapters, articleList };
    });
    await newPage.close();
    resolve(dataObj);
  });
