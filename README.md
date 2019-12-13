# web-scraping

## Summary
Get data of 
1. Products from `shopping.naver.com` 
2. Who traveled where and when from `instagram.com`  

Via scrapping function of apify which is one of node.js sdk

---
### Used open source
- ~~cheerio~~
- **axios**
- **puppeteer**
- **apify**

각 클릭하는거 함수 모으기
const d =[...document.querySelectorAll ("#home_category_area > div.co_category_menu > ul > li > a")].map(category=>category.click.bind(e))

각 카테고리별 큰 컬럼 클릭 가져옴, 근데 이거 별로임
[...document.querySelectorAll("#home_category_area .co_col strong a")].map(col=>col.click)
href를 가져와서 한번에 가야함
[...document.querySelectorAll("#home_category_area .co_col strong a")].map(col=>col.href)

다음 페이지
document.querySelector("#_result_paging > a.next").click() ==null일떄까지
전체 상품수/limit로 for문 돌려도 되나 위가 일반적임

상품명
document.querySelector("#_search_list > div.search_list.basis > ul > li .info .tit").innerText
[...document.querySelectorAll("#_search_list > div.search_list.basis > ul > li .info .tit")].map(product=>product.innerText)
가격
document.querySelector("#_search_list > div.search_list.basis > ul > li .info .price em .num").innerText
[...document.querySelectorAll("#_search_list > div.search_list.basis > ul .info .price em .num")].map(product=>product.innerText)
세부 카테고리
document.querySelector("#_search_list > div.search_list.basis > ul > li .info .depth").innerText
[...document.querySelectorAll("#_search_list > div.search_list.basis > ul .info .depth")].map(product=>product.innerText)


이미지
document.querySelector("#_search_list > div.search_list.basis > ul > li ._productLazyImg").src
[...document.querySelectorAll("#_search_list > div.search_list.basis > ul > li ._productLazyImg")].map(product=>product.src)


const d={}

패션의류 > 여성의류 > 코트 
피렌비 투웨이카라 페이크퍼 롱코트 GTS9-CT11052D|169,000

https://search.shopping.naver.com/search/category.nhn?pagingIndex=3&cat_id=50000167