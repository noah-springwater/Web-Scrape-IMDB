var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/scrape', function(req, res){
  //all web scraping magic happens here

  url = 'http://www.imdb.com/title/tt1229340/'; //anchorman 2

  //the structure of our request call
  //the first parameter is our url
  //the callback fn takes 3 parameters, an error, response status code, and the html

  request(url, function (error, response, html) {
    //first check for errors
    if (!error) {
      var $ = cheerio.load(html);

    //Define the variables we're going to capture
      var title, release, rating;
      var json = { title : "", release : "", rating: ""};
    //After going into dev tools and finding unique header for name as starting point

    $('.header').filter(function() {
    //Store data we filter into variable so we can easily see what's going on
      var data = $(this);

    //Title rests within the first child element of header
    //Grab text

      title = data.children().first().text();

      release = data.children().last().children().text();

    //Store title in json

      json.title = title;

    //Store release date in json

      json.release = release;

    })

    $('.star-box-giga-star').filter(function () {
      var data = $(this);

      rating = data.text();

      json.rating = rating;

    })

  }

fs.writeFile('output.json', JSON.stringify(json, null, 4), function (err) {

  console.log('File successfully written! - file is in project directory for output.json file');

})
  //Send message to browser reminding app it doesn't have a UI
  res.send('Check your console!')

    });
})

app.listen('8081')

console.log('Listening on port 8081');

exports = module.exports = app;
