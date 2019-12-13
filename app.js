const puppeteer = require("puppeteer");
const log = console.log;
const targetHost = "https://shopping.naver.com/";
const req = nodes => {};
const doPuppeteer = async () => {
    try {
        const browser = await puppeteer.launch({
            headless: true, // headless모드는 터미널에서만 실행할건지의 여부
            // slowMo:1000, // 실행속도
            defaultViewport: {
                width: 1980,
                height: 1080,
                isMobile: false
            }
        });
        const page = await browser.newPage();
        page.on("console", msg => console.log("PAGE LOG:", msg.text()));
        await page.goto(targetHost);
        await page.waitFor(1000);

        // while (true) {
        const categoryPageUrlList = await page.$$eval(
            "#home_category_area > div.co_category_menu > ul > li > a",
            nodes =>
                nodes.map(category => {
                    category.click();
                    return [
                        ...document.querySelectorAll(
                            "#home_category_area .co_col strong a"
                        )
                    ].map(col => col.href);
                })
        );

        const flattenUrlList = categoryPageUrlList.flat();
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
        browser.close();
    } catch (err) {
        console.log(err);
    }
};
console.log("scrapping start!!");
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
