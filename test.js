const puppeteer = require('puppeteer');
const targetHost = 'https://shopping.naver.com/';
const { productNameSelector, productPriceSelector, productCategorySelector } = require('./selector.json');

const collectTargetCategoryUrls = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch({
        headless: false, // headless모드는 터미널에서만 실행할건지의 여부
        // slowMo:1000, // 실행속도
        defaultViewport: {
          width: 1980,
          height: 1080,
          isMobile: false,
        },
      });
      const page = await browser.newPage();
      page.on('console', msg => console.log('PAGE LOG:', msg.text()));
      await page.goto(targetHost);
      await page.waitFor(1000);

      // while (true) {
      const categoryPageUrlList = await page.$$eval('#home_category_area > div.co_category_menu > ul > li > a', nodes =>
        nodes.map(category => {
          category.click();
          return [...document.querySelectorAll('#home_category_area .co_col strong a')].map(col => col.href);
        }),
      );

      browser.close();
      resolve(categoryPageUrlList.flat());
    } catch (err) {
      reject(err);
    }
  });
};
const loadProductsInfo = async (page, selector) =>
  await page.$$eval(selector, nodes => {
    console.log(nodes);
    return nodes.map(product => {
      return product.innerText;
    });
  });
const loadProductsInfos = async page => {
  console.log('asdfasfdasfa@@@@@@@@@@@@@@@@@@');
  const namesPromise = await loadProductsInfo(page, productNameSelector);
  const pricePromise = await loadProductsInfo(page, productPriceSelector);
  const categoryPromise = await loadProductsInfo(page, productCategorySelector);

  return [namesPromise, pricePromise, categoryPromise];
};

const openPages = async url => {
  try {
    const browser = await puppeteer.launch({
      headless: true, // headless모드는 터미널에서만 실행할건지의 여부
      // slowMo:1000, // 실행속도
      defaultViewport: {
        width: 1980,
        height: 1080,
        isMobile: false,
      },
    });

    const page = await browser.newPage();

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    await page.goto(url);

    await page.exposeFunction('loadProductsInfos', loadProductsInfos);
    await page.exposeFunction('loadProductsInfo', loadProductsInfo);
    const arr = [];
    await page.evaluate(arr => {
      const config = {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true,
        attributeOldValue: true,
        characterDataOldValue: true,
      };
      const target = document.querySelector('#_search_list');
      const body = document.querySelector('body');

      const observer = new MutationObserver(async mutations => {
        const isProductsReloaded = mutations.some(mutation => {
          return mutation.target.className === 'sort_content';
        });
        if (isProductsReloaded) {
          console.log('adf@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@', arr);
          console.log(
            await page.$$eval(productNameSelector, nodes => {
              console.log(nodes);
              return nodes.map(product => {
                console.log(product);
                return product.innerText;
              });
            }),
          );
          const result = await Promise.all([
            page.$$eval(productNameSelector, nodes => {
              console.log(nodes);
              return nodes.map(product => {
                return product.innerText;
              });
            }),
            page.$$eval(productPriceSelector, nodes => {
              console.log(nodes);
              return nodes.map(product => {
                return product.innerText;
              });
            }),
            page.$$eval(productCategorySelector, nodes => {
              console.log(nodes);
              return nodes.map(product => {
                return product.innerText;
              });
            }),
          ]);
          console.log(result);
        }
      });
      observer.observe(target, config);
    }, arr);

    arr.push(
      await Promise.all([
        page.$$eval(productNameSelector, nodes => {
          console.log(nodes);
          return nodes.map(product => {
            return product.innerText;
          });
        }),
        page.$$eval(productPriceSelector, nodes => {
          console.log(nodes);
          return nodes.map(product => {
            return product.innerText;
          });
        }),
        page.$$eval(productCategorySelector, nodes => {
          console.log(nodes);
          return nodes.map(product => {
            return product.innerText;
          });
        }),
      ]),
    );

    const nextButton = await page.$('#_result_paging > a.next');
    if (nextButton) {
      await nextButton.click();
    }
  } catch (err) {
    console.log('promise', err);
  }
};

console.log('scrapping start!!');

const main = async () => {
  try {
    //const categoryUrls = await collectTargetCategoryUrls();
    //console.log(categoryUrls);
    //await openPages(categoryUrls[0]);
    await openPages('https://search.shopping.naver.com/category/category.nhn?cat_id=50000167');
  } catch (err) {
    console.log(err);
  }
};

main();
const config = {
  attributes: true,
  childList: true,
  characterData: true,
  subtree: true,
  attributeOldValue: true,
  characterDataOldValue: true,
};
const target = document.querySelector('#_search_list');
const observer = new MutationObserver(async mutations => {
  mutations.all(mutation => {
    console.log(mutations);
    if (mutation.target.className === 'sort_content') {
      console.log('mutation', mutation.target.className);
      console.log(mutation);
    }
    return mutation.target.className === 'sort_content';
  });
});
observer.observe(target, config);
