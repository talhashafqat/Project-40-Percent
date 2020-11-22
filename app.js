const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const googlePlusToken = require("passport-google-plus-token");
const passport = require("passport");
const cookieSession = require("cookie-session");
const GoogleStrategy = require('passport-google-oauth20').Strategy;

//Google OAuth2.0 Connection & Data Retrival ----- Start -----
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: "547959045512-916mjvsfcbjmktvua4m3kik7qvsfrvom.apps.googleusercontent.com",
    clientSecret: "mWVuudwVFSAYzx5Pum5nwB9v",
    callbackURL: "http://localhost:3000/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile._json.email);
    return(cb);
  }
));

//Google OAuth2.0 Connection & Data Retrival ----- End -----


const app = express();

//MongoDB Connection Established to LocalHost
mongoose.connect("mongodb://localhost:27017/growingTreesDB", { useNewUrlParser: true, useUnifiedTopology: true });

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    name: "GrowingTress",
    keys: ["key1", "key2"]
}));
app.use(passport.initialize());
app.use(passport.session());


//New User Data Schema
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

var alreadyRegisteredError;
var invalidUser;

//Google OAuth Connection
app.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/success');
  });


app.get("/", function (req, res) {
    alreadyRegisteredError = false;
    invalidUser = false;
    res.render("signin", {invalidUser: invalidUser});

});

app.get("/failed", function(req,res){
    res.send("Login Failed");
});

app.get("/success", function(req,res){
    res.send("Welcome ! Successfully Logged In");
});

app.get("/signup", function (req, res) {
    res.render("signup", { alreadyRegisteredError: alreadyRegisteredError });
});

app.post("/signin", function (req, res) {
    const userEmail = req.body.userEmail;
    const userPassword = req.body.userPassword;

    User.findOne({ email: userEmail , password: userPassword}, function (err, foundList) {
        if (!err) {
            if (!foundList) {
              invalidUser = true;
                res.render("signin", {invalidUser: invalidUser});
            } else {
                res.send("User logged In");
            }
          }
      });
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
                alreadyRegisteredError = true;
                console.log("User is registered");
                res.render("signup", { alreadyRegisteredError: alreadyRegisteredError });
            }
        }
    });

});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});
