const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.render("signin");
});

app.get("/signup", function (req, res) {
    res.render("signup");
});

app.post("/signin", function (req, res) {
    const userEmail = req.body.userEmail;
    const userPassword = req.body.userPassword;

    console.log(userEmail);
    console.log(userPassword);
});

app.post("/signup", function (req, res) {
    const userName = req.body.userName;
    const userEmail = req.body.userEmail;
    const userPassword = req.body.userPassword;

    console.log(userName + ' ' + userEmail + ' ' + userPassword);
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});
