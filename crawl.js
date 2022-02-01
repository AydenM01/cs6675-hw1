var Crawler = require("crawler");
const extractor = require("unfluff");
var natural = require("natural");
const stemmer = natural.PorterStemmer;
const seed = "https://cc.gatech.edu";
const { performance } = require("perf_hooks");
const fs = require("fs");
const axios = require('axios');

const stemmedKeywordsPlot = [
  {
    x: [],
    y: [],
    type: "scatter",
  },
];

const linksExtractedPlot = [
  {
    x: [],
    y: [],
    type: "scatter",
  },
];

const crawlablePlot = [
  {
    x: [],
    y: [],
    type: "scatter",
  },
];

const visitedPages = new Set();
let count = 0;

//global metrics
const stemmedKeywordsSet = new Set();
let urls_extracted = 0;
let urls_crawlable = 0;

var c = new Crawler({
  maxConnections: 10,
  // This will be called for each crawled page
  callback: function (error, res, done) {
    if (error) {
      console.log(error);
    } else {
      var $ = res.$;
      url = res.options.uri;

      findLinks($, url);

      let data = extractor($.root().html());

      let next_links = [];
      data.links.forEach((link) => {
        if (link.href.charAt(0) === "/") {
          next_links.push(link.href);
        }
      });

      let stemmed_keywords = stemmer.tokenizeAndStem(data.text);

      //plot data
      stemmed_keywords.forEach(keyword => {
        stemmedKeywordsSet.add(keyword);
      });
      stemmedKeywordsPlot[0].x.push(performance.now());
      stemmedKeywordsPlot[0].y.push(stemmedKeywordsSet.size);

      //Uncomment this line to send data to mongoDB
      //saveDoc(data.title, stemmed_keywords, res.options.uri);
    }
    done();
  },
});

// finds relative links and adds them to queue
async function findLinks(cheerio_$) {
  //response.body is the whole content of the page if you want to store some kind of data from the web page you should do it here
  let $ = cheerio_$;
  let links = $("body")
    .find("a")
    .filter(function (i, el) {
      return $(this).attr("href") != null;
    })
    .map(function (i, x) {
      return $(this).attr("href");
    });

  urls_extracted += links.length;
  linksExtractedPlot[0].x.push(performance.now());
  linksExtractedPlot[0].y.push(urls_extracted);

  if (links.length > 0) {
    let crawlable_count = 0;
    links.map(function (i, x) {
      //only add absolute links from root, this means url will always be cc.gatech.edu
      if (x.length > 1 && x.charAt(0) == "/") {
        crawlable_count++;
        let nextUrl = seed + x;
        crawl(nextUrl);
      }
    });
    urls_crawlable += crawlable_count;
    crawlablePlot[0].x.push(performance.now());
    crawlablePlot[0].y.push(urls_crawlable);
  }
}

function crawl(url) {
  if (!visitedPages.has(url) && count < 1000) {
    console.log(
      "adding " + url + " to queue" + " at time: " + performance.now()
    );
    console.log("queue size: " + c.queueSize);
    c.queue(url);
    count++;
    visitedPages.add(url);
  } else {
    let plot1 = JSON.stringify(stemmedKeywordsPlot[0]);
    let plot2 = JSON.stringify(linksExtractedPlot[0]);
    let plot3 = JSON.stringify(crawlablePlot[0]);

    fs.writeFileSync("plot1.json", plot1);
    fs.writeFileSync("plot2.json", plot2);
    fs.writeFileSync("plot3.json", plot3);

  }
}

const saveDoc = (title, content_stemmed, uri) => {
    axios.post("http://localhost:5000/saveDoc", {
      title: title,
      content_stemmed: content_stemmed,
      uri: uri,
    });
  };

crawl(seed);
