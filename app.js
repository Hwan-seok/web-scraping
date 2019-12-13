const puppeteer = require("puppeteer");
const log = console.log;
const targetHost = "https://shopping.naver.com/";
const req = nodes => {};
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

        // while (true) {
        console.log("start");
        const partyListPerPage = await page.$$eval(
            "#home_category_area > div.co_category_menu > ul > li > a",
            nodes => {
                console.log(nodes);
            }
        );
        //     targetURLs.push(partyListPerPage);
        //     const next = await page.$("._next");
        //     const isNextable = await next.evaluate(
        //         node => !node.classList.contains("off")
        //     );
        //     log(isNextable);
        //     if (isNextable) {
        //         console.log("nexting");
        //         await next.click();
        //         await page.waitFor(100);
        //         continue;
        //     }
        //     break;
        // }
        // log(targetURLs);
        // const result = targetURLs.flat();
        // console.log("result", result);
        // await page. nodes => {
        //     nodes.map(node => node.firstElementChild.href);
        // });
    } catch (err) {
        console.log(err);
    }
};

doPuppeteer();
/*
[...document.querySelectorAll("#home_category_area > div.co_category_menu > ul > li")].map(li=>({
    className : li.className,
    click:li.click
}
))
*/
const collectEntryPoint = () => {
    return Promise((resolve, reject) => {});
};
