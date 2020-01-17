const puppeteer = require('puppeteer');
const dotenv = require('dotenv');
dotenv.config();
const agent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36';
const crawling = async () => {
  const browser = await puppeteer.launch({
    headless: process.env.NODE_ENV === 'production',
    args: ['--window-size=1920,1080', '--disable-notifications'],
    defaultViewport: {
      width: 1080,
      height: 1080,
      isMobile: false,
    },
  });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  await page.setUserAgent(agent);
  await page.goto('https://www.facebook.com/');
  await page.type('#email', '01064306352');
  await page.type('#pass', process.env.password);
  await page.waitForResponse(response => {
    return response.url().includes('login_attempt');
  });
  console.log('완료');
  //   await page.close();
  //   await browser.close();
};

crawling();
