const axios = require("axios");
const cheerio = require("cheerio");

const err = console.error;
const log = console.log;

const doCrawling = async () => {
    try {
        return await axios.get(
            "https://search.shopping.naver.com/search/category.nhn?cat_id=50000805"
        );
    } catch (err) {
        log(err);
    }
};

doCrawling().then(resultHtml => {
    log(resultHtml);
});
