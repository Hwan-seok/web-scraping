const puppeteer = require('puppeteer'); // postman으로 요청 보냈을 때 이미지 로딩 상태 확인하기

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: {
        width: 1080,
        height: 1080,
        // slowMo: 100000,
        isMobile: false,
      },
    });
    const page = await browser.newPage();
    await page.goto('https://unsplash.com');
    let result = [];
    while (result.length <= 300) {
      const srcs = await page.evaluate(() => {
        window.scrollTo(0, 0);
        let imgs = [];
        const imgEls = document.querySelectorAll('figure');
        if (imgEls.length) {
          imgEls.forEach(v => {
            console.log(v);
            let img = v.querySelector('img._2zEKz');

            if (img && img.src) {
              imgs.push(img.src);
              v.parentElement.removeChild(v);
            }
          });
        }
        window.scrollBy(0, 300);
        setTimeout(() => {
          window.scrollBy(0, 500);
        }, 500);
        return imgs;
      });
      result = result.concat(srcs);
      console.log(result.length);
      await page.waitForSelector('figure');
    }
    console.log(result);
    await page.close();
    await browser.close();
  } catch (e) {
    console.error(e);
  }
};

crawler();
