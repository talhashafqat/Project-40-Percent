const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var ObjectId = require('mongoose').Types.ObjectId;
const googlePlusToken = require("passport-google-plus-token");
const passport = require("passport");
const cookieSession = require("cookie-session");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const multer = require("multer");
const fs = require("fs")
const imageDataURI = require('image-data-uri');
const {
  createWorker
} = require('tesseract.js');
var _ = require('underscore');

const { games } = require("googleapis/build/src/apis/games");


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
var lrdata = [];
var gamedata = [];
var unityProgress = [];
var signedInUser;
var kidProfileCurrentlyIn;
var colors = ["#0062FF", "#50B5FF", "#FF974A", "#FFC542"];
var progressOverview = ["spark-1", "spark-2", "spark-3", "spark-4"];
var updateSuccessful;;
var mathsResult;
var mathAnswer;
var englishResult;
var englishAnswer;
var urduResult;
var urduAnswer;
var engTaskList = ['E_Task1', 'E_Task2', 'E_Task3', 'E_Task4', 'E_Task5', 'E_Task6', 'E_Task7', 'E_Task8', 'E_Task9', 'E_Task10', 'E_Task11', 'E_Task12',
  'E_Task13', 'E_Task14', 'E_Task15', 'E_Task16', 'E_Task17', 'E_Task18', 'E_Task19', 'E_Task20', 'E_Task21', 'E_Task22', 'E_Task23', 'E_Task24'
];
var engPlanner = {};
var mathTaskList = ['M_Task1', 'M_Task2', 'M_Task3', 'M_Task4', 'M_Task5', 'M_Task6', 'M_Task7', 'M_Task8', 'M_Task9', 'M_Task10', 'M_Task11', 'M_Task12',
  'M_Task13', 'M_Task14', 'M_Task15', 'M_Task16', 'M_Task17', 'M_Task18', 'M_Task19', 'M_Task20', 'M_Task21', 'M_Task22', 'M_Task23', 'M_Task24'
];
var mathPlanner = {};
var urduTaskList = ['U_Task1', 'U_Task2', 'U_Task3', 'U_Task4', 'U_Task5', 'U_Task6', 'U_Task7', 'U_Task8', 'U_Task9', 'U_Task10', 'U_Task11', 'U_Task12',
  'U_Task13', 'U_Task14', 'U_Task15', 'U_Task16', 'U_Task17', 'U_Task18', 'U_Task19', 'U_Task20', 'U_Task21', 'U_Task22', 'U_Task23', 'U_Task24'
];
var urduPlanner = {};
var selectedDates = [];
var dayTaskLength = [];
var kidID;
var gameKidsArray = [];
var learningResourcesArray = [];

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}


//New Kid Data newUserSchema

const plannerDB = new mongoose.Schema({
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

const progressSchema = new mongoose.Schema({
  engGamesProgress:{
    type: Number,
    required: [true]
  },
  mathGamesProgress:{
    type: Number,
    required: [true]
  },
  urduGamesProgress:{
    type: Number,
    required: [true]
  },
  engLrProgress:{
    type: Number,
    required: [true]
  },
  mathLrProgress:{
    type: Number,
    required: [true]
  },
  urduLrProgress:{
    type: Number,
    required: [true]
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
  experiencePoints: {
    type: Number
  },
  gameScores: [gameScoreSchema],
  learningResources: [learningResources],
  progress: [progressSchema],
  engPlanner: [],
  urduPlanner: [],
  mathPlanner: [],
  dates: [],
  dayTaskLength:[]
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
  //kids: [newKidSchema]
  kids: [newKidSchema]
});




// User Collection Created in MongoDB
const User = mongoose.model("User", newUserSchema);
const Kid = mongoose.model("kid", newKidSchema);
const GameScore = mongoose.model("GameScore", gameScoreSchema);
const LearningResource = mongoose.model("LearningResource", learningResources);
const Progres = mongoose.model("Progres", progressSchema);



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


  const newProgress = new Progres({
    engGamesProgress: 0,
    mathGamesProgress: 0,
    urduGamesProgress: 0,
    engLrProgress: 0,
    mathLrProgress: 0,
    urduLrProgress: 0
  })

  unityProgress.push(newProgress);
  console.log(unityProgress);

  const newKid = new Kid({
    name: kidName,
    age: kidAge,
    gender: kidLevel,
    experiencePoints: 0,
    progress: unityProgress,
    gameScores: [],
    learningResources: [],
    engPlanner:[],
    urduPlanner: [],
    mathPlanner:[],
    dates: [],
    dayTaskLength:[]
  });

  kids.push(newKid);

  User.findOneAndUpdate({
    email: newUserEmail
  }, {
    kids: kids
  }, function(err, foundList) {
    if (!err) {
      console.log("Updated Successfully");
      unityProgress.pop();
      console.log(unityProgress);
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
  kidID = req.body.kidID;

  User.findOne({
    email: signedInUser
  }, function(err, foundList) {
    if (!err) {
      if (foundList) {
        kidProfile = foundList.kids;
        for (let i = 0; i < kidProfile.length; i++) {
          if (kidProfile[i]._id == kidID) {
            res.render("profile", {
              kidProfile: kidProfile[i],
              kidID: kidID
            })
            kidProfileCurrentlyIn = {
              kidID: kidID,
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

// app.get("/webglLoader", (req, res) => {
//   res.render('webglLoader');
// });

app.post("/webglLoader", (req,res) => {
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

        const newProgress = new Progres({
          engGamesProgress: 0,
          mathGamesProgress: 0,
          urduGamesProgress: 0,
          engLrProgress: 0,
          mathLrProgress: 0,
          urduLrProgress: 0
        })

        unityProgress.push(newProgress);
        console.log(unityProgress);

        const newKid = new Kid({
          name: kidName,
          age: kidAge,
          gender: kidLevel,
          experiencePoints: 0,
          progress: unityProgress,
          gameScores: [],
          learningResources: [],
          engPlanner: [],
          urduPlanner: [],
          mathPlanner:[],
          dates: [],
          dayTaskLength:[]
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
            unityProgress.pop();
            console.log(unityProgress);
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

// Connect Unity App

app.get("/connectunity", (req, res) => {
  User.findOne({
    email: signedInUser
  }, function(err, foundList){
    if(!err){
      if(foundList){
        kids = foundList.kids;
        kids.forEach(kid => {
          if(kid._id == kidProfileCurrentlyIn.kidID){
              res.json(kid);
          }
        });
      }
    }
  });
});

// DATA COMING AND GOING TO UNITY

app.get("/progress", (req, res) => {
  let progress;
  User.findOne({
    email: signedInUser
  }, function(err, foundList){
    if(!err){
      if(foundList){
        kids = foundList.kids;
        kids.forEach(kid => {
          if(kid._id == kidProfileCurrentlyIn.kidID){
            progress = kid.progress[0];
            res.json(progress);
            console.log("Progress sent to unity: ");
            console.log(progress);
          }
        });
      }
    }
  });

});

app.get("/getxp", (req, res) => {
  let xp = 0;
  User.findOne({
    email: signedInUser
  }, function(err, foundList){
    if(!err){
      if(foundList){
        kids = foundList.kids;
        kids.forEach(kid => {
          if(kid._id == kidProfileCurrentlyIn.kidID){
            xp = kid.experiencePoints;
            console.log("XP going to unity")
            console.log(xp);
            console.log(typeof(xp));
            res.json(xp);
          }
        });
      }
    }
  });
});

app.post("/add-game-score", (req, res) => {
  // New game
  const newSubject = req.body.subject;
  const newTitle = req.body.gameTitle;
  const newGameScore = req.body.gameScore;
  const newGameTime = req.body.gameTime;
  const newExperiencePoints = req.body.experiencePoints;
  const newgameStatus = req.body.gameStatus;
  User.findOne({
    email: signedInUser
  }, function(err, foundList){
    if(!err){
      if(foundList){
        console.log(kids);
        kids = foundList.kids;
        console.log(kids);
        const newgame = new GameScore({
            subject: newSubject,
            gameTitle: newTitle,
            gameScore: newGameScore,
            gameTime: newGameTime,
            experiencePoints: newExperiencePoints,
            gameStatus: newgameStatus
        });

        for (let i = 0; i < kids.length; i++) {
          if(kids[i]._id == kidProfileCurrentlyIn.kidID){
            User.findOne({email: signedInUser}).then((user) => {
              user.kids[i].gameScores.push(newgame);
              user.kids[i].experiencePoints += parseInt(newExperiencePoints);
              console.log("gameScores: " + user.kids[i].gameScores);
              user.save();
            });
          }
        }

      // User.findOneAndUpdate({
      //   email: signedInUser
      // }, {
      //   $set: {"kids.$[].gameScores": [newgame]}
      // }, (err, foundList) => {
      //   if(foundList){
      //     console.log(kids);
      //     console.log("Added Game Successfully");
      //     console.log(foundList);
      //   }
      // }, useFindAndModify = false);
      }
    }
  });
});

app.post("/add-lr-data", (req, res) => {
  // New LR
  const newSubject= req.body.subject;
  const newName= req.body.name;
  const newStatus= req.body.status;
  const newLearningTime= req.body.learningTime;

  User.findOne({
    email: signedInUser
  }, function(err, foundList){
    if(!err){
      if(foundList){
        kids = foundList.kids;
        const newLearningResource= new LearningResource({
          subject: newSubject,
          name: newName,
          status: newStatus,
          learningTime: newLearningTime
        });
        // var new_kids = [];
        for (let i = 0; i < kids.length; i++) {
          if(kids[i]._id == kidProfileCurrentlyIn.kidID){
            User.findOne({email: signedInUser}).then((user) => {
              user.kids[i].learningResources.push(newLearningResource);
              user.kids[i].experiencePoints += 20;
              console.log("Learning Resources: " + user.kids[i].learningResources);
              user.save();
            });
          }
        }
      }
    }
  });
});

// app.post("/updatexp", (req, res) => {
//   const xp = req.body.experiencePoints;
//   const xpInInt = parseInt(xp);
//   User.findOne({
//     email: signedInUser
//   }, function(err, foundList){
//     if(!err){
//       if(foundList){
//         kids = foundList.kids;

//         for (let i = 0; i < kids.length; i++) {
//           if(kids[i]._id == kidProfileCurrentlyIn.kidID){
//             User.findOne({email: signedInUser}).then((user) => {
//               user.kids[i].experiencePoints += xpInInt;
//               console.log("XP: " + user.kids[i].experiencePoints);
//               user.save();
//             });
//           }
//         }
//       }
//     }
//   });
// });

// GETTING PROGRESS OF ALL OF THE KID PORTAL ROUTES

app.post("/getEngLrProgress", (req, res) => {
  const engLrProgress = parseInt(req.body.engLrProgress);
  User.findOne({
    email: signedInUser
  }, function(err, foundList){
    if(!err){
      if(foundList){
        kids = foundList.kids;
        kids.forEach(kid => {
          if(kid._id == kidProfileCurrentlyIn.kidID){
            console.log("New LR Eng Progress")
            console.log(engLrProgress);
            console.log("ENG LR PROGRESS STORED IN DB");
            console.log(kid.progress[0].engLrProgress);
            if(kid.progress[0].engLrProgress < engLrProgress){
              kid.progress[0].engLrProgress = engLrProgress;
            }

          }
        });

      User.findOneAndUpdate({
        email: signedInUser
      }, {
        kids:kids
      }, (err, foundList) => {
        if(foundList){
          console.log("Updated Successfully")
        }
      }, useFindAndModify = false);
      }
    }
  });
});

app.post("/getEngGameProgress", (req, res) => {
  const engGamesProgress = parseInt(req.body.engGamesProgress);
  User.findOne({
    email: signedInUser
  }, function(err, foundList){
    if(!err){
      if(foundList){
        kids = foundList.kids;
        kids.forEach(kid => {
          if(kid._id == kidProfileCurrentlyIn.kidID){
            console.log("New game Progress")
            console.log(engGamesProgress);
            kid.progress[0].engGamesProgress = engGamesProgress;
          }
        });

      User.findOneAndUpdate({
        email: signedInUser
      }, {
        kids:kids
      }, (err, foundList) => {
        if(foundList){
          console.log("Updated Successfully")
        }
      });
      }
    }
  });
});

app.post("/getUrduLrProgress", (req, res) => {
  const urduLrProgress = parseInt(req.body.urduLrProgress);
  User.findOne({
    email: signedInUser
  }, function(err, foundList){
    if(!err){
      if(foundList){
        kids = foundList.kids;
        kids.forEach(kid => {
          if(kid._id == kidProfileCurrentlyIn.kidID){
            console.log("New game Progress")
            console.log(urduLrProgress);
            kid.progress[0].urduLrProgress = urduLrProgress;
          }
        });

      User.findOneAndUpdate({
        email: signedInUser
      }, {
        kids:kids
      }, (err, foundList) => {
        if(foundList){
          console.log("Updated Successfully")
        }
      });
      }
    }
  });
});

app.post("/getUrduGameProgress", (req, res) => {
  const urduGamesProgress = parseInt(req.body.urduGamesProgress);
  User.findOne({
    email: signedInUser
  }, function(err, foundList){
    if(!err){
      if(foundList){
        kids = foundList.kids;
        kids.forEach(kid => {
          if(kid._id == kidProfileCurrentlyIn.kidID){
            console.log("New game Progress")
            console.log(urduGamesProgress);
            kid.progress[0].urduGamesProgress = urduGamesProgress;
          }
        });

      User.findOneAndUpdate({
        email: signedInUser
      }, {
        kids:kids
      }, (err, foundList) => {
        if(foundList){
          console.log("Updated Successfully")
        }
      });
      }
    }
  });
});

app.post("/getMathLrProgress", (req, res) => {
  const mathLrProgress = parseInt(req.body.mathLrProgress);
  User.findOne({
    email: signedInUser
  }, function(err, foundList){
    if(!err){
      if(foundList){
        kids = foundList.kids;
        kids.forEach(kid => {
          if(kid._id == kidProfileCurrentlyIn.kidID){
            console.log("New game Progress")
            console.log(mathLrProgress);
            kid.progress[0].mathLrProgress = mathLrProgress;
          }
        });

      User.findOneAndUpdate({
        email: signedInUser
      }, {
        kids:kids
      }, (err, foundList) => {
        if(foundList){
          console.log("Updated Successfully")
        }
      });
      }
    }
  });
});

app.post("/getMathGameProgress", (req, res) => {
  const mathGamesProgress = parseInt(req.body.mathGamesProgress);
  User.findOne({
    email: signedInUser
  }, function(err, foundList){
    if(!err){
      if(foundList){
        kids = foundList.kids;
        kids.forEach(kid => {
          if(kid._id == kidProfileCurrentlyIn.kidID){
            console.log("New game Progress")
            console.log(mathGamesProgress);
            kid.progress[0].mathGamesProgress = mathGamesProgress;
          }
        });

      User.findOneAndUpdate({
        email: signedInUser
      }, {
        kids:kids
      }, (err, foundList) => {
        if(foundList){
          console.log("Updated Successfully")
        }
      });
      }
    }
  });
});

//Alphabets OCR

app.get("/maths", function(req, res) {
  res.render("maths", {
    result: mathsResult,
    answer: mathAnswer
  });
});

app.get("/english", function(req, res) {
  res.render("english", {
    result: englishResult,
    answer: englishAnswer
  });
});

app.get("/urdu", function(req, res) {
  res.render("urdu", {
    result: urduResult,
    answer: urduAnswer
  });
});

app.post("/MathsOCR", function(req, res) {

  image = {
    data: req.body.image
  };
  console.log("This part is working");

  console.log(image.data);

  fs.writeFile('image.png', image.data, {
    encoding: 'base64'
  }, function(err) {
    console.log('File created');
  });

  fs.readFile('image.png', function(err, data) {
    if (err) throw err;
    const worker = createWorker({
      logger: m => console.log(m),
    });

    const convertToText = async () => {
      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      await worker.setParameters({
        tessedit_char_whitelist: '0123456789',
      });
      const {
        data: {
          text
        }
      } = await worker.recognize(data);
      console.log("text from file: ", text);
      mathsResult = true;
      mathAnswer = text;

    }
    convertToText();

  });



});

app.post("/EnglishOCR", function(req, res) {
  image = {
    data: req.body.image
  };
  console.log("This part is working");

  console.log(image.data);

  fs.writeFile('image.png', image.data, {
    encoding: 'base64'
  }, function(err) {
    console.log('File created');
  });

  fs.readFile('image.png', function(err, data) {
    if (err) throw err;
    const worker = createWorker({
      logger: m => console.log(m),
    });

    const convertToText = async () => {
      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      await worker.setParameters({
        tessedit_char_whitelist: 'ABCDEFFGHIJKLMNOPQRSTUVWXYZ',
      });
      const {
        data: {
          text
        }
      } = await worker.recognize(data);
      console.log("text from file: ", text);
      englishResult = true;
      englishAnswer = text;
    }
    convertToText();
    res.redirect("/english");
  });

});

app.post("/UrduOCR", function(req, res) {
  image = {
    data: req.body.image
  };
  console.log("This part is working");

  console.log(image.data);

  fs.writeFile('image.png', image.data, {
    encoding: 'base64'
  }, function(err) {
    console.log('File created');
  });

  fs.readFile('image.png', function(err, data) {
    if (err) throw err;
    const worker = createWorker({
      logger: m => console.log(m),
    });

    const convertToText = async () => {
      await worker.load();
      await worker.loadLanguage('urd');
      await worker.initialize('urd');
      await worker.setParameters({
        tessedit_char_whitelist: 'آ ا ب پ ت ٹ ث ج چ ح خ د ڈ ذ ر ڑ ز ژ س ش ص ض ط ظ ع غ ف ق ک گ ل م ن و ہ ی ے',
      });
      const {
        data: {
          text
        }
      } = await worker.recognize(data);
      console.log("text from file: ", text);
      urduResult = true;
      urduAnswer = text;
    }
    convertToText();
  });

});


// Custom Planner

app.get("/customplanner", function(req, res) {


  User.findOne({
    email: signedInUser
  }, function(err, foundList) {
    if (!err) {
      if (foundList) {
        kidProfile = foundList.kids;
        console.log(kidProfile);
        for (let i = 0; i <= kidProfile.length; i++) {
          if (kidProfile[i]._id == kidID) {
            if(kidProfile[i].engPlanner.length != 0){
              res.render("customplanner", {
                engPlanner: kidProfile[i].engPlanner[0],
                mathPlanner: kidProfile[i].mathPlanner[0],
                urduPlanner: kidProfile[i].urduPlanner[0],
                dates: kidProfile[i].dates,
                dayTaskLength: kidProfile[i].dayTaskLength
              });
              break;
            } else {
              res.render("customplanner", {
                engPlanner: {},
                mathPlanner: {},
                urduPlanner: {},
                dates: [],
                dayTaskLength: []
              });
              break;
            }

          }
        }
      }
    }
  })

});

app.post("/customplanner", function(req, res) {
  res.redirect("customplanner");
});

app.post("/createplanner", function(req, res) {

  var engPlanner = {};
  var mathPlanner = {};
  var urduPlanner = {};
  var selectedDates = [];
  var dayTaskLength = [];

  const startDate = new Date(req.body.startDate);
  const endDate = new Date(req.body.endDate);

  console.log(startDate + endDate);

  const getDatesBetweenDates = (startDate, endDate) => {
    let dates = []
    //to avoid modifying the original date
    const theDate = new Date(startDate)
    while (theDate < endDate) {
      dates = [...dates, new Date(theDate)]
      theDate.setDate(theDate.getDate() + 1)
    }
    dates = [...dates, endDate]
    return dates
  }

  selectedDates = getDatesBetweenDates(startDate, endDate);

  console.log(selectedDates[0].toDateString());

  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const diffDays = Math.round(Math.abs((startDate - endDate) / oneDay));

  console.log("Number of Days" + diffDays);
  // var remainderTasks = engTaskList.length % diffDays;
  // var notRemainingTasksDivision = diffDays - remainderTasks;
  var numberOfTaskPerDay = Math.round(engTaskList.length / diffDays);

  console.log("Number of tasks to be divided Per Day" + numberOfTaskPerDay);

  if (numberOfTaskPerDay < (engTaskList.length / diffDays)) {
    console.log("Modulus Exist");
    var remainderTasks = engTaskList.length % diffDays;
    var notRemainingTasksDivision = diffDays - remainderTasks;

    for (i = 1, j = 1, l = 0; i <= diffDays; i++) {
      engPlanner['day' + i] = {};
      mathPlanner['day' + i] = {};
      urduPlanner['day' + i] = {};
      if (i <= notRemainingTasksDivision) {
        for (k = 0; k < numberOfTaskPerDay; k++) {
          engPlanner['day' + i]['Task' + j] = engTaskList[l];
          mathPlanner['day' + i]['Task' + j] = mathTaskList[l];
          urduPlanner['day' + i]['Task' + j] = urduTaskList[l];
          j++;
          l++;
          console.log(engPlanner);
        }
      } else {
        for (k = 0; k < numberOfTaskPerDay + 1; k++) {
          engPlanner['day' + i]['Task' + j] = engTaskList[l];
          mathPlanner['day' + i]['Task' + j] = mathTaskList[l];
          urduPlanner['day' + i]['Task' + j] = urduTaskList[l];
          j++;
          l++;
          console.log(engPlanner);
        }
      }
    }

  } else {
    console.log("Modulus Doesnt exist");
    for (i = 1, j = 1, l = 0; i <= diffDays; i++) {
      engPlanner['day' + i] = {};
      mathPlanner['day' + i] = {};
      urduPlanner['day' + i] = {};
      for (k = 0; k < numberOfTaskPerDay; k++) {
        engPlanner['day' + i]['Task' + j] = engTaskList[l];
        mathPlanner['day' + i]['Task' + j] = mathTaskList[l];
        urduPlanner['day' + i]['Task' + j] = urduTaskList[l];
        j++;
        l++;
        console.log(engPlanner);
      }
    }
  }

  console.log(engPlanner);
  console.log(mathPlanner);
  console.log(urduPlanner);

  console.log(_.size(engPlanner));
  var engPlannerSize  = _.size(engPlanner);

  for (var a=1, b=0; a<=engPlannerSize; a++,b++){
      console.log(_.size(engPlanner['day'+a]));
      dayTaskLength.push(_.size(engPlanner['day'+a]));
      console.log('Push Successful');
  }

  console.log(dayTaskLength);

  // for (var a = 0,b=1; a < _.size(engPlanner); a++,b++) {
  //   dayTaskLength[a]  = _.size(engPlanner['day'+b]);
  // }

  console.log(engPlanner);
  console.log(mathPlanner);
  console.log(urduPlanner);
  console.log(selectedDates);
  console.log(dayTaskLength);


  var engPlannerArray = [];
  var mathPlannerArray = [];
  var urduPlannerArray = [];

  engPlannerArray.push(engPlanner);
  mathPlannerArray.push(mathPlanner);
  urduPlannerArray.push(urduPlanner);

  User.findOne({
    email: signedInUser
  }, function(err, foundList) {
    if (!err) {
      if (foundList) {
        var new_kids = foundList.kids;
        for (let i = 0; i < foundList.kids.length; i++) {
          if (new_kids[i]._id == kidID) {
            new_kids[i].engPlanner = engPlannerArray;
            new_kids[i].mathPlanner = mathPlannerArray;
            new_kids[i].urduPlanner = urduPlannerArray;
            new_kids[i].dates = selectedDates;
            new_kids[i].dayTaskLength = dayTaskLength;
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
            // res.redirect("/dashboard");
          }
        });
      }
    }
  });


  res.render("customplanner", {
    engPlanner: engPlanner,
    mathPlanner: mathPlanner,
    urduPlanner: urduPlanner,
    dates: selectedDates,
    dayTaskLength: dayTaskLength
  });

  // for(i=1,j=1,l=0;i<=diffDays;i++){
  //   planner['day' + i] = {};
  //   if(i<=notRemainingTasksDivision){
  //     for (k=0;k<numberOfTaskPerDay;k++){
  //         planner['day' + i]['Task' + j] = tasksList[l];
  //         j++;
  //         l++;
  //         console.log(planner);
  //     }
  //   }
  //   else {
  //     for (k=0;k<numberOfTaskPerDay+1;k++){
  //         planner['day' + i]['Task' + j] = tasksList[l];
  //         j++;
  //         l++;
  //         console.log(planner);
  //     }
  //   }
  // }


  // Latest Working Version
  // for(i=1,j=1,l=0;i<=diffDays;i++){
  //   planner['day' + i] = {};
  //   for (k=0;k<numberOfTaskPerDay;k++){
  //       planner['day' + i]['Task' + j] = tasksList[l];
  //       j++;
  //       l++;
  //       console.log(planner);
  //   }
  // }


  // This code is working fine and dividing tasks
  // for(i=1,j=0;i<=diffDays;i++,j+=2){
  //   planner['day' + i] = {['Task' + j]: tasksList[j], ['Task' + (j+1)]: tasksList[j+1] };
  // }



});

//Tracing
app.get("/tracing", function(req, res) {
  res.render("tracing");
});


//settings
app.get("/settings", function(req, res) {
  res.render("settings", {
    updateSuccessful: updateSuccessful
  });
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
