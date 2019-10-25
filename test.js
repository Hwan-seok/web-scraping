const axios = require("axios");
const cheerio = require("cheerio");
//const instance = axios.create();
const error = console.error;
const log = console.log;

const userAgentHeader = "Mozilla/5.0";
const url =
    "https://search.shopping.naver.com/search/category.nhn?cat_id=50000805";

//instance.defaults.headers.common["User-Agent"] = userAgentHeader;
const doCrawling = async () => {
    try {
        return await axios({
            method: "GET",
            url,
            headers: {
                "User-Agent": userAgentHeader
            }
        });
    } catch (err) {
        error(err);
    }
};

doCrawling()
    .then(resultHtml => {
        const $ = cheerio.load(resultHtml.data);
        const $goodsList = $(".goods_list").children("._itemSection");
        const extracted = [];

        $goodsList.each((idx, element) => {
            extracted[idx] = $(element)
                .children(".info")
                .children(".tit")
                .children("a")
                .text();
        });
        return extracted;
    })
    .then(result => log(result));
