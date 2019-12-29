const targetHost = 'https://shopping.naver.com/';
const { productNameSelector, productPriceSelector, productCategorySelector } = require('./selector.json');
const puppeteer = require('puppeteer-extra');

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const collectTargetCategoryUrls = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch({
        headless: false, // headless모드는 터미널에서만 실행할건지의 여부
        slowMo: 5000, // 실행속도

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
      await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');

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
const openPages = async url => {
  try {
    const browser = await puppeteer.launch({
      headless: false, // headless모드는 터미널에서만 실행할건지의 여부
      slowMo: 1000, // 실행속도
      defaultViewport: {
        width: 1980,
        height: 1080,
        isMobile: false,
      },
    });

    const page = await browser.newPage();
    function describe(jsHandle) {
      return jsHandle.executionContext().evaluate(obj => {
        // serialize |obj| however you want
        return JSON.stringify(obj);
      }, jsHandle);
    }

    page.on('console', async msg => {
      const args = await Promise.all(msg.args().map(arg => describe(arg)));
      console.log(...args);
    });
    await page.goto(url);

    page.evaluate(
      ({ productNameSelector, productPriceSelector, productCategorySelector }) => {
        try {
          const arr = [];
          const config = {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true,
            attributeOldValue: true,
            characterDataOldValue: true,
          };
          const initProductNameNodes = document.querySelectorAll(productNameSelector);
          const initProductPriceNodes = document.querySelectorAll(productPriceSelector);
          const initProductCategoryNodes = document.querySelectorAll(productCategorySelector);

          const initNames = Array.from(initProductNameNodes, product => product.innerText);
          const initPrices = Array.from(initProductPriceNodes, product => product.innerText);
          const initCategories = Array.from(initProductCategoryNodes, product => product.innerText);

          const length = initNames.length;
          for (let i = 0; i < length; i++) {
            const product = {
              name: initNames[i],
              price: initPrices[i],
              category: initCategories[i],
            };
            arr.push(product);
          }
          console.log(arr.length);
          console.log(arr[arr.length - 1].name);
          const nextButton = document.querySelector('#_result_paging > a.next');
          if (nextButton) {
            console.log('nextnext1');
            nextButton.click();
          }
          const target = document.querySelector('#_search_list');
          const observer = new MutationObserver(async mutations => {
            const isProductsReloaded = mutations.some(mutation => {
              if (mutation.target.className === 'sort_content') {
                console.log('mutation', mutation.target.className);
                console.log(mutation);
              }
              return mutation.target.className === 'sort_content';
            });
            if (isProductsReloaded) {
              console.log('reloaded!!!!!!!!!!!!!!!!!!!');
              const productNameNodes = document.querySelectorAll(productNameSelector);
              const productPriceNodes = document.querySelectorAll(productPriceSelector);
              const productCategoryNodes = document.querySelectorAll(productCategorySelector);

              const names = Array.from(productNameNodes, product => product.innerText);
              const prices = Array.from(productPriceNodes, product => product.innerText);
              const categories = Array.from(productCategoryNodes, product => product.innerText);
              for (let i = 0; i < names.length; i++) {
                const product = {
                  name: names[i],
                  price: prices[i],
                  category: categories[i],
                };
                arr.push(product);
              }
              console.log(arr.length);
              console.log(arr[arr.length - 44].name);

              const nextButton = document.querySelector('#_result_paging > a.next');
              if (nextButton) {
                console.log('nextnext2');
                nextButton.click();
              }
            }
          });
          observer.observe(target, config);
        } catch (error) {
          console.log(error);
        }
      },
      { productNameSelector, productPriceSelector, productCategorySelector },
    );
    // );
    // const initProducts = [];
    // initProducts.push(
    //   await Promise.all([
    //     page.$$eval(productNameSelector, nodes => {
    //       console.log(nodes);
    //       return nodes.map(product => {
    //         return product.innerText;
    //       });
    //     }),
    //     page.$$eval(productPriceSelector, nodes => {
    //       console.log(nodes);
    //       return nodes.map(product => {
    //         return product.innerText;
    //       });
    //     }),
    //     page.$$eval(productCategorySelector, nodes => {
    //       console.log(nodes);
    //       return nodes.map(product => {
    //         return product.innerText;
    //       });
    //     }),
    //   ]),
    // );

    const nextButton = await page.$('#_result_paging > a.next');
    if (nextButton) {
      console.log('aSdfasf');
      await nextButton.click();
    }
    await page.waitFor(3000);
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
