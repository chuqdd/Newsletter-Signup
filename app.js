//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us10.api.mailchimp.com/3.0/lists/eaab0e2e99";

  const options = {
    method: "POST",
    auth: "don1:xc1c1eec4be92fe24778c69425ae56f17-us10"
  };

  const request = https.request(url, options, function(response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname+"/success.html");
    } else {
      res.sendFile(__dirname+"/failure.html");
    }

    response.on("data", function(data) {
      var parsedData = JSON.parse(data);
      console.log("error_count: "+parsedData.error_count);
      console.log(response.statusCode);
    });
  });

  request.write(jsonData);
  request.end();
  // res.send(null);
});


app.post("/failure", function(req, res) {
  res.redirect("/");
});

// app.listen(3000, function() {
app.listen(process.env.PORT || 3000, function() {
  console.log("server started on port 3000");
});

// mailchimp API key
// c1c1eec4be92fe24778c69425ae56f17-us10

// List ID
// eaab0e2e99
