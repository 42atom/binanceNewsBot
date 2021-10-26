const superagent = require('superagent');
const cheerio = require('cheerio');
const request = require('request-json');
// const http = require('http');
const axios = require('axios')

var chat_url = "https://chat.digis.cyou/hooks/d45YqyJfyeTDKHLR8/ZtvpNExiFBisKmrZmwR35i3qecNS7MbThttdruCiJQKQoJgb";

// var client = request.createClient(chat_url);


var dataUrl = null

let hotNews = null;
const webSite = 'https://www.binance.com'
const url = 'https://www.binance.com/en/support/announcement'

superagent.get(url).end((err, res) => {
  if (err) {
    // 如果访问失败或者出错，会这行这里
    console.log(`热点新闻抓取失败 - ${err}`)
  } else {
    // 访问成功，请求http页面所返回的数据会包含在res
    // 抓取热点新闻数据
    hotNews = getHotNews(res)
    console.log(hotNews);

    axios
      .post(chat_url, dataUrl)
      .then(res => {
        console.log(`statusCode: ${res.status}`)
        console.log(res)
      })
      .catch(error => {
        console.error(error)
      })

  }
});


let getHotNews = (res) => {
  // 访问成功，请求http页面所返回的数据会包含在res.text中。
  /* 使用cheerio模块的cherrio.load()方法，将HTMLdocument作为参数传入函数
     以后就可以使用类似jQuery的$(selectior)的方式来获取页面元素
   */
  let $ = cheerio.load(res.text);

  let con = $('div#__APP').find('a')
  let news = con.nextAll()
  var t = null
  news.each(function () {

    let text = $(this).text()
    if (text.match('Binance Will List')) {
      t = $(this).text()
      // console.log(webSite + $(this).attr('href'))

      dataUrl = {
        text: " 币安上新 \n " + t + "\n" + webSite + $(this).attr('href'),
      };



      // client.post('', data, function (err, res, body) {
      //   console.log(res.statusCode, body);
      // });
    }

  })
  console.log(t)
  return t

};

