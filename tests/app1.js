const puppeteer = require("puppeteer");
const log = console.log;
const targetHost =
    "https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&mra=bk00&query=%EB%B6%88%EA%BD%83%EB%AC%B8%ED%99%94%EC%B6%95%EC%A0%9C";
const req = nodes => {
    console.log("mapping");
    const targetURIs = nodes.map(node => {
        return node.firstElementChild.href;
    });
    nodes.reduce((prev, cur) => {
        const href = cur.firstElementChild.href;
        const 
        prev[`${href}`] = 

        return prev
    }, {});
    return array;
};
const doPuppeteer = async () => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: {
                width: 1980,
                height: 1080,
                isMobile: false
            }
        });
        const page = await browser.newPage();

        await page.goto(targetHost);
        await page.waitFor(1000);
        await page.waitForSelector(".ftv_lst");

        let targetURLs = [];
        log(typeof targetURLs);
        while (true) {
            console.log("start");
            const partyListPerPage = await page.$$eval(".ftv_lst ul li", req);
            targetURLs.push(partyListPerPage);
            const next = await page.$("._next");
            const isNextable = await next.evaluate(
                node => !node.classList.contains("off")
            );
            log(isNextable);
            if (isNextable) {
                console.log("nexting");
                await next.click();
                await page.waitFor(100);
                continue;
            }
            break;
        }
        log(targetURLs);
        const result = targetURLs.flat();
        console.log("result", result);
        // await page. nodes => {
        //     nodes.map(node => node.firstElementChild.href);
        // });
    } catch (err) {
        console.log(err);
    }
};

doPuppeteer();
