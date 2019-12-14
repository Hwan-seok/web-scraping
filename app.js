const puppeteer = require('puppeteer');
const targetHost = 'https://shopping.naver.com/';

const collectTargetCategoryUrls = browser => {
  return new Promise(async (resolve, reject) => {
    try {
      const page = await browser.newPage();
      page.on('console', msg => console.log('PAGE LOG:', msg.text()));
      await page.goto(targetHost);
      await page.waitFor(1000);

      // while (true) {
      const categoryPageUrlList = await page.$$eval(
        '#home_category_area > div.co_category_menu > ul > li > a',
        nodes =>
          nodes.map(category => {
            category.click();
            return [
              ...document.querySelectorAll(
                '#home_category_area .co_col strong a',
              ),
            ].map(col => col.href);
          }),
      );

      resolve(categoryPageUrlList.flat());
    } catch (err) {
      reject(err);
    }
  });
};

const openPages = (browser, urls) => {
  return new Promise(async (resolve, reject) => {
    const promises = [];
    const len = urls.length;
    console.log(len);
    for (let i = 0; i < len; i++) {
      promises.push(
        browser.newPage().then(async page => {
          page.on('console', msg => console.log('PAGE LOG:', msg.text()));
          await page.goto(urls[i]);
          return await page.$$eval(
            '#_search_list > div.search_list.basis > ul > li .info .tit',
            nodes => {
              return nodes.map(product => {
                return product.innerText;
              });
            },
          );
        }),
      );
    }
    // const a = await Promise.all(promises);
    console.log(a);
    console.log(a.length);
    // const page = await browser.newPage();
    // await page.goto(urls[0]);
    // const result = await page.$$eval(
    //   '#_search_list > div.search_list.basis > ul > li .info .tit',
    //   nodes => {
    //     return nodes.map(product => {
    //       return product.innerText;
    //     });
    //   },
    // );

    // for (let i = 0; i < 10; i++) {
    //   promises.push(
    //     browser.newPage().then(async page => {
    //       await page.goto(urls[i]);
    //       return await page.$$eval(
    //         '#_search_list > div.search_list.basis > ul > li .info .tit',
    //         nodes => {
    //           console.log(nodes.length);
    //           console.log(nodes);
    //           return nodes.map(product => {
    //             return product.innerText;
    //           });
    //         },
    //       );
    //     }),
    //   );
    // }

    // await Promise.all(promises);
    // browser.close();
  });
};
console.log('scrapping start!!');

const main = async () => {
  const browser = await puppeteer.launch({
    headless: false, // headless모드는 터미널에서만 실행할건지의 여부
    // slowMo:1000, // 실행속도
    defaultViewport: {
      width: 1980,
      height: 1080,
      isMobile: false,
    },
  });
  try {
    const categoryUrls = await collectTargetCategoryUrls(browser);
    console.log(categoryUrls);
    await openPages(browser, categoryUrls);
    browser.close();
  } catch (err) {
    console.log(err);
  }
};
main();

const collectEntryPoint = () => {
  return Promise((resolve, reject) => {});
};
