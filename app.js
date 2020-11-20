const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb://localhost:27017/growingTreesDB", { useNewUrlParser: true, useUnifiedTopology: true });

app.set('view engine', 'ejs');
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));


const newUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Check Data Entry, no name specified"]
    },
    email: {
        type: String,
        required: [true, "Check Data Entry, no email specified"]
    },
    password: {
        type: String,
        required: [true, "Check Data Entry, no password specified"]
    }
});

const User = mongoose.model("User", newUserSchema);


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

    User.findOne({ email: userEmail }, function (err, foundList) {
        if (!err) {
            if (!foundList) {
                console.log("User is not registered");
                const newUser = new User({
                    name: userName,
                    email: userEmail,
                    password: userPassword
                });

                newUser.save();
            } else {
                console.log("User is registered");
            }
        }
    });



});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});
