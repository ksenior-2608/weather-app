//config .env
require("dotenv").config();

//acquire packages
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();

//parse form data
app.use(bodyParser.urlencoded({
  extended: true
}));

//use ejs templates
app.set("view engine","ejs");

//listen to port
app.listen(3000, function() {
  console.log("Server is up and running");
});

//handle home route
app.route("/")

  //render form for making post request
  .get(function(req, res) {
    res.render("form");
  })

  //make api call
  .post(function(req, res) {
    //parse data
    const cityName = req.body.cityname;
    const query = cityName;
    //handle parameters for url
    const apiKey = process.env.API_KEY;
    const units = "metric";
    //end point api
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + units;
    //api call to open weather site
    https.get(url, function(response) {
      //fetch data
      response.on("data", function(data) {
        // parse data as JSON obj
        const weatherData = JSON.parse(data);
        //accesing data in JSON obj
        const temp = weatherData.main.temp;
        const weatherDescription = weatherData.weather[0].description;
        const imageURL = "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png";
        //write response
        res.write("<h1> The avg. temp of " + cityName + " is " + temp + " degree celsius</h1>");
        res.write("<p> Weather in " + cityName + " would be " + weatherDescription + ".</p>");
        res.write(`<img src= ${imageURL} >`);
        //send response
        res.send();
      });
    });
  });
