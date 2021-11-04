const superagent = require('superagent');
const cheerio = require('cheerio');
const request = require('request-json');
// const http = require('http');
const axios = require('axios')

// 上报url
var chat_url = "https://chat.digis.cyou/hooks/d45YqyJfyeTDKHLR8/ZtvpNExiFBisKmrZmwR35i3qecNS7MbThttdruCiJQKQoJgb";

var dataUrl = null
var hotNews = null
var checkedCoins = []
const webSite = 'https://www.binance.com'
const url = 'https://www.binance.com/en/support/announcement'

axios
  .post(chat_url, { text: "开始爬取检测coin in BN ，检测间隔为12s"})

// 定时执行间隔
setInterval(intervalRequestSite, 12500);

function intervalRequestSite() {

  superagent.get(url).end((err, res) => {
    if (err) {
      // 如果访问失败或者出错，会这行这里
      console.log(`BN新闻抓取失败 - ${err}`)
      errorInfo = { text: "BN新闻抓取失败" }

      axios
        .post(chat_url, errorInfo)
        .then(res => {
          console.log(`statusCode: ${res.status}`)
          // console.log(res)
        })
        .catch(error => {
          console.error(error)
        })
    } else {
      // 访问成功，请求http页面所返回的数据会包含在res
      // 抓取热点新闻数据
      hotNews = getHotNews(res)
      console.log(hotNews);
      console.log(checkedCoins);

      if (checkedCoins.includes(hotNews) == false) {
        checkedCoins.push(hotNews)
        axios
          .post(chat_url, dataUrl)
          .then(res => {
            console.log(`statusCode: ${res.status}`)
            // console.log(res)
          })
          .catch(error => {

            console.error(error)
          })
      }
    }
  });
}

let getHotNews = (res) => {
  // 访问成功，请求http页面所返回的数据会包含在res.text中。
  /* 使用cheerio模块的cherrio.load()方法，将HTMLdocument作为参数传入函数
     以后就可以使用类似jQuery的$(selectior)的方式来获取页面元素
   */
  let $ = cheerio.load(res.text);

  let con = $('#__APP').find('a')
  // let con = $('body').find('a')
  let news = con.contents()
  // console.log(news)

  // t 是触发条件的截取文字
  var t = "没找到新list"
  // 获得每一个元素，并检索
  news.each(function () {

    let text = $(this).text()
    console.log(text)
    if (text.match('Binance Will List')) {
      t = $(this).text()
      console.log(webSite + $(this).attr('href'))

      dataUrl = {
        text: " 币安上新 \n " + t + "\n" + webSite + $(this).attr('href'),
      }
    }
  })
  // console.log(t)
  return t
};

