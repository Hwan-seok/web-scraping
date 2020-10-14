const targetHost = 'https://shopping.naver.com/';
const { productNameSelector, productPriceSelector, productCategorySelector, productImageSelector } = require('./selector.json');
const puppeteer = require('puppeteer-extra');
const fs = require('fs');
const axios = require('axios');

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

fs.readdir('productImage', err => {
  if (err) {
    console.error('productImage 폴더가 없어 productImage 폴더를 생성');
    fs.mkdirSync('productImage');
  }
});
const collectTargetCategoryUrls = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch({
        headless: process.env.NODE_ENV === 'production', // headless모드는 터미널에서만 실행할건지의 여부
        args: ['--window-size=1920,1080', '--disable-notifications,'], // 브라우져 크기
        // slowMo: 5000, // 실행속도
        defaultViewport: {
          // 실제 데이터가 나오는 화면 크기
          width: 1980,
          height: 1080,
          isMobile: false,
        },
        userDataDir: '',
      });
      const page = await browser.newPage();
      page.on('console', msg => console.log('PAGE LOG:', msg.text()));
      await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
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
const openPages = async url => {
  try {
    const browser = await puppeteer.launch({
      headless: false, // headless모드는 터미널에서만 실행할건지의 여부
      // slowMo: 1000, // 실행속도
      defaultViewport: {
        width: 1980,
        height: 1080,
        isMobile: false,
      },
      args: ['--window-size=1920,1080'],
    });
    let finalResult = [];
    const page = await browser.newPage();

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    await page.goto(url);
    while (finalResult.length < 1000) {
      await page.waitForResponse(response => {
        return response.url().includes('category.nhn');
      });
      for (let i = 0; i < 17; i++) {
        await page.waitFor(200);
        await page.evaluate(() => window.scrollBy(0, 1000));
      }

      const info = await page.evaluate(
        ({ productNameSelector, productPriceSelector, productCategorySelector, productImageSelector }) => {
          let result = [];
          const imageUrls = Array.from(document.querySelectorAll(productImageSelector), product => {
            const src = product.src;
            if (!src.startsWith('https://search.pstatic.net/common/')) {
              return src.split('?')[0];
            } else {
              return decodeURIComponent(src.split('?src=')[1].split('&')[0]);
            }
          });
          const names = Array.from(document.querySelectorAll(productNameSelector), product => product.innerText);
          const prices = Array.from(document.querySelectorAll(productPriceSelector), product => product.innerText);
          const categories = Array.from(document.querySelectorAll(productCategorySelector), product => product.innerText);

          const loopCount = names.length;
          for (let i = 0; i < loopCount; i++) {
            result.push({
              imageUrl: imageUrls[i],
              name: names[i],
              price: prices[i],
              category: categories[i],
            });
          }
          return result;
        },
        { productNameSelector, productPriceSelector, productCategorySelector, productImageSelector },
      );

      finalResult.push(...info);
      const nextButton = await page.$('#_result_paging > a.next');
      if (nextButton) {
        console.log('go to next page');
        await page.evaluate(btn => btn.click(), nextButton);
      }
    }

    const labelStream = fs.createWriteStream('label.txt');
    const featureStream = fs.createWriteStream('feature.txt');

    finalResult.forEach(async (v, i) => {
      try {
        labelStream.write(`${v.category}\n`);
        featureStream.write(`${v.name}|${v.price}\n`);
        const imgResult = await axios.get(v.imageUrl, {
          responseType: 'arraybuffer',
        });
        fs.writeFile(`productImage/${v.name}.jpg`, imgResult.data);
      } catch (err) {
        console.log(err);
      }
    });

    featureStream.end('');
    featureStream.on('finish', () => {
      console.log('END');
    });
  } catch (err) {
    console.log('err', err);
  }
};

console.log('scrapping start!!');

const main = async () => {
  try {
    //const categoryUrls = await collectTargetCategoryUrls();
    //console.log(categoryUrls);
    //await openPages(categoryUrls[0]);
    await openPages('https://search.shopping.naver.com/category/category.nhn?pagingIndex=1&pagingSize=80&cat_id=50000167');
  } catch (err) {
    console.log(err);
  }
};

main();
