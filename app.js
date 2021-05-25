const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const googlePlusToken = require("passport-google-plus-token");
const passport = require("passport");
const cookieSession = require("cookie-session");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const multer = require("multer");
const {
  createWorker
} = require('tesseract.js');

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "./uploads")
  },
  filename: (req, res, cb) => {
    cb(null, req.file)
  }
});

const upload = multer({
  storage: storage
});


// const worker = createWorker({
//   logger: m => console.log(m),
// });
//
// const convertToText = async () => {
//   await worker.load();
//   await worker.loadLanguage('eng');
//   await worker.initialize('eng');
//   const {
//     data: {
//       text
//     }
//   } = await worker.recognize();
//   console.log("text from file: ", text);
// }
// convertToText();


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
    User.findOne({
      email: profile._json.email
    }, function(err, foundList) {
      if (!err) {
        if (!foundList) {
          console.log("This user is not registered");
          const newUser = new User({
            name: profile._json.name,
            email: profile._json.email
          });
          newUser.save();
          console.log("User saved");
          signedInUser = profile._json.email;
          return cb(err, foundList);
        } else {
          console.log("This user is registered with following email address");
          console.log(foundList.email);
          signedInUser = foundList.email;
          return cb(err, foundList);
        }
      }
    });

  }
));

//Google OAuth2.0 Connection & Data Retrival ----- End -----


const app = express();

//MongoDB Connection Established to LocalHost
mongoose.connect("mongodb+srv://admin-talha:growingtrees123@cluster0.8kepi.mongodb.net/growingTreesDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieSession({
  name: "GrowingTress",
  keys: ["key1", "key2"]
}));
app.use(passport.initialize());
app.use(passport.session());

//Global Variables
var alreadyRegisteredError;
var invalidUser;
var kids = [];
var signedInUser;
var kidProfileCurrentlyIn;
var colors = ["#0062FF", "#50B5FF", "#FF974A", "#FFC542"];
var progressOverview = ["spark-1", "spark-2", "spark-3", "spark-4"];
var updateSuccessful


//New Kid Data newUserSchema

const planner = new mongoose.Schema({
  day: {
    type: Number,
    required: [true, "Check Data Entry, no day specified"]
  },
  subject: {
    type: String,
    required: [true, "Check Data Entry, no subject specified"]
  },
  activityID: {
    type: String,
    required: [true, "Check Data Entry, no Activity ID specified"]
  },
  activtiyName: {
    type: String,
    required: [true, "Check Data Entry, no Activity Name specified"]
  },
  activityStatus: {
    type: Boolean,
    required: [true, "Check Data Entry, no Activity Status specified"]
  }
});

const learningResources = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Check Data Entry, no name specified"]
  },
  subject: {
    type: String,
    required: [true, "Check Data Entry, no subject specified"]
  },
  status: {
    type: Boolean,
    required: [true, "Check Data Entry, no status specified"]
  },
  learningTime: {
    type: String,
    required: [true, "Check Data Entry, no time specified"]
  }
});

const gameScoreSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, "Check Data Entry, no subject specified"]
  },
  gameTitle: {
    type: String,
    required: [true, "Check Data Entry, no Game Title specified"]
  },
  gameScore: {
    type: Number,
    required: [true, "Check Data Entry, no Game Score specified"]
  },
  gameTime: {
    type: String,
    required: [true, "Check Data Entry, no Game Time specified"]
  },
  experiencePoints: {
    type: Number,
    required: [true, "Check Data Entry, no Experience Points specified"]
  },
  gameStatus: {
    type: Boolean,
    required: [true, "Check Data Entry, no Game Status specified"]
  }
});

const newKidSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Check Data Entry, no name specified"]
  },
  age: {
    type: Number,
    required: [true, "Check Data Entry, no age specified"]
  },
  gender: {
    type: String,
    required: [true, "Check Data Entry, no level specified"]
  },
  subjects: [],
  experiencePoints: {
    type: Number
  },
  gameScore: [],
  learningResources: [],
  planner: []
});

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
    // required: [true, "Check Data Entry, no password specified"]
  },
  kids: []
});



// User Collection Created in MongoDB
const User = mongoose.model("User", newUserSchema);
const Kid = mongoose.model("kid", newKidSchema);


//User kids Name Found
// User.findOne({ email: "Hamza@gmail.com"}, function (err, foundList) {
//     if (!err) {
//         if (foundList) {
//             console.log(foundList.kids[0].name);
//         }
//       }
//   });




//Google OAuth Connection
app.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  }));

app.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/newUser'
  }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/dashboard');
  });


app.get("/", function(req, res) {
  alreadyRegisteredError = false;
  invalidUser = false;
  res.render("signin", {
    invalidUser: invalidUser
  });

});

app.get("/newUser", function(req, res) {
  res.render("kidsregistration", {
    newUserEmail: signedInUser
  });
});

app.get("/signup", function(req, res) {
  res.render("signup", {
    alreadyRegisteredError: alreadyRegisteredError
  });
});

app.post("/signin", function(req, res) {
  signedInUser = null;
  const userEmail = req.body.userEmail;
  const userPassword = req.body.userPassword;

  User.findOne({
    email: userEmail,
    password: userPassword
  }, function(err, foundList) {
    if (!err) {
      if (!foundList) {
        invalidUser = true;
        res.render("signin", {
          invalidUser: invalidUser
        });
      } else {
        signedInUser = userEmail;
        res.redirect("/dashboard");
      }
    }
  });
});



app.post("/signup", function(req, res) {
  const userName = req.body.userName;
  const userEmail = req.body.userEmail;
  const userPassword = req.body.userPassword;

  User.findOne({
    email: userEmail
  }, function(err, foundList) {
    if (!err) {
      if (!foundList) {
        console.log("User is not registered");
        const newUser = new User({
          name: userName,
          email: userEmail,
          password: userPassword
        });

        newUser.save();
        res.render("kidsregistration", {
          newUserEmail: userEmail
        });
      } else {
        alreadyRegisteredError = true;
        console.log("User is registered");
        res.render("signup", {
          alreadyRegisteredError: alreadyRegisteredError
        });

      }
    }
  });

});


// app.get("/kidsregistration", function(req,res){
//     res.render("kidsregistration");
// });

app.post("/kidsregistration", function(req, res) {

  const kidName = req.body.kidName;
  const kidAge = req.body.kidAge;
  const kidLevel = req.body.kidLevel;
  const newUserEmail = req.body.newUserEmail;

  const newKid = new Kid({
    name: kidName,
    age: kidAge,
    gender: kidLevel,
    experiencePoints: 0
  });

  kids.push(newKid);

  User.findOneAndUpdate({
    email: newUserEmail
  }, {
    kids: kids
  }, function(err, foundList) {
    if (!err) {
      console.log("Updated Successfully");
      signedInUser = newUserEmail;
      res.redirect("/dashboard");
    }
  });



});


// Front DashBoard link

app.get("/dashboard", function(req, res) {
  //User kids Name Found
  User.findOne({
    email: signedInUser
  }, function(err, foundList) {
    if (!err) {
      if (foundList) {
        if (foundList.kids) {
          res.render("dashboard", {
            kids: foundList.kids,
            colors: colors,
            progress: progressOverview
          });
        }
      } else {
        res.redirect("/");
      }
    }
  });
});

app.post("/dashboard", function(req, res) {
  var kidProfile = []
  const kidID = req.body.kidID;

  User.findOne({
    email: signedInUser
  }, function(err, foundList) {
    if (!err) {
      if (foundList) {
        kidProfile = foundList.kids;
        for (let i = 0; i < kidProfile.length; i++) {
          if (kidProfile[i]._id == kidID) {
            res.render("profile", {
              kidName: kidProfile[i].name,
              experiencePoints: kidProfile[i].experiencePoints,
              age: kidProfile[i].age,
              kidID: kidID
            })
            kidProfileCurrentlyIn = {
              kidName: kidProfile[i].name,
              kidAge: kidProfile[i].age,
              experiencePoints: kidProfile[i].experiencePoints
            }
          }
        }
      }
    }
  })
});

app.get("/webglLoader", (req, res) => {
  res.render('webglLoader');
});

app.post("/addkid", function(req, res) {
  console.log("Kid Adding Works Fine");
  const kidName = req.body.kidName;
  const kidAge = req.body.kidAge;
  const kidLevel = req.body.kidLevel;

  User.findOne({
    email: signedInUser
  }, function(err, foundList) {
    if (!err) {
      if (foundList) {
        console.log(foundList.kids);
        kids = foundList.kids;

        const newKid = new Kid({
          name: kidName,
          age: kidAge,
          gender: kidLevel,
          experiencePoints: 0
        });
        kids.push(newKid);
        console.log(kids);
        User.findOneAndUpdate({
          email: signedInUser
        }, {
          kids: kids
        }, function(err, foundList) {
          if (foundList) {
            console.log("Updated Successfully");
          }
        });

      }
    }
  })

  res.redirect("/dashboard");

});


app.get("/virtualboard", function(req, res) {
  res.render("virtualboard");
});


app.post("/deletekid", function(req, res) {
  const kidID = req.body.kidID;
  console.log(kidID);
  User.findOne({
    email: signedInUser
  }, function(err, foundList) {
    if (!err) {
      if (foundList) {
        var new_kids = [];
        console.log(kids);
        for (let i = 0; i < foundList.kids.length; i++) {
          if (foundList.kids[i]._id != kidID) {
            new_kids.push(foundList.kids[i])
          }
        }
        console.log(kids);
        User.findOneAndUpdate({
          email: signedInUser
        }, {
          kids: new_kids
        }, function(err, foundList) {
          if (foundList) {
            console.log("Updated Successfully");
            res.redirect("/dashboard");
          }
        });
      }
    }
  });
});

app.get("/connectunity", (req, res) => {
  res.json(kidProfileCurrentlyIn);
});

//Alphabets OCR

app.get("/maths", function(req, res) {
  res.render("maths");
});

app.get("/english", function(req, res) {
  res.render("english");
});

app.get("/urdu", function(req, res) {
  res.render("urdu");
});


//Tracing
app.get("/tracing", function(req, res) {
  res.render("tracing");
});


//settings
app.get("/settings", function(req, res) {
  res.render("settings", {updateSuccessful: updateSuccessful});
});

app.post("/settings", function(req, res) {
  const emailUpdate = req.body.emailupdate;
  const passwordUpdate = req.body.passwordupdate;

  if (emailUpdate == "") {
    console.log("Email  Update  is  not  enter ");
    User.findOneAndUpdate({
      email: signedInUser
    }, {
      password: passwordUpdate
    }, function(err, foundList) {
      if (foundList) {
        console.log(foundList);
        console.log("Password Updated Successfully");
        updateSuccessful = true;
        res.render("settings", {
          updateSuccessful: updateSuccessful
        });
        updateSuccessful = false;
      }
    });
  } else if (passwordUpdate == "") {
    User.findOneAndUpdate({
      email: signedInUser
    }, {
      email: emailUpdate
    }, function(err, foundList) {
      if (foundList) {
        console.log(foundList);
        console.log("Email Updated Successfully");
        updateSuccessful = true;
        res.render("settings", {
          updateSuccessful: updateSuccessful
        });
        updateSuccessful = false;
      }
    });
  } else {
    User.findOneAndUpdate({
      email: signedInUser
    }, {
      email: emailUpdate,
      password: passwordUpdate
    }, function(err, foundList) {
      if (foundList) {
        console.log(foundList);
        console.log("Email and Password Updated Successfully");
        updateSuccessful = true;
        res.render("settings", {
          updateSuccessful: updateSuccessful
        });
        updateSuccessful = false;
      }
    });
  }




});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
