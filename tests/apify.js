const Apify = require("apify");

Apify.main(async () => {
    const requestQueue = await Apify.openRequestQueue();

    const crawler = new Apify.PuppeteerCrawler({
        puppeteerPoolOptions: {
            useLiveView: true,
            slowMo: 300
        },
        requestQueue,
        handlePageFunction: async ({ page, request }) => {
            requestQueue.addRequest({ url: "https://apify.com" });
            // This function is called to extract data from a single web page
            // 'page' is an instance of Puppeteer.Page with page.goto(request.url) already called
            // 'request' is an instance of Request class with information about the page to load
            await Apify.pushData({
                title: await page.title(),
                url: request.url,
                succeeded: true
            });
        },
        handleFailedRequestFunction: async ({ request }) => {
            // This function is called when the crawling of a request failed too many times
            await Apify.pushData({
                url: request.url,
                succeeded: false,
                errors: request.errorMessages
            });
        }
    });
    await crawler.run();
});
