require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3002;
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const db = require("./database/database");

db.then(() => console.log("Connected to MongoDB.")).catch((err) =>
  console.log(err)
);
const DiscordStrategy = require("./strategies/discordstrategy");
const authRoute = require("./routes/auth");
const profileRoute = require("./routes/profile");
const registerRoute = require("./routes/register");
const checkAuth = require("./routes/checkAuth");
const editRoute = require("./routes/editRoute");
const themeRouter = require('./routes/theme');
const { AdminSchema, LeaderSchema } = require("./models/DiscordUser");

// Session

app.use(
  session({
    secret: "iasuhbdaaOSFIUBHohasbd872390rfasd",
    cookie: {
      maxAge: 60000 * 60 * 24,
    },
    saveUninitialized: false,
    name: "discord.oauth2.lulu",
  })
);

// Allowing to use API request from different PORTS

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes

app.use("/auth", authRoute);
app.use("/profile/", profileRoute);
app.use("/register", registerRoute);
app.use("/api/checkauth", checkAuth);
app.use("/api/edit", editRoute);
app.use("/theme/", themeRouter);
app.get("/admins", isAuthorized, async (req, res) => {
  try {
    if((req.user.lvl < 1 || !req.user.lvl) || !req.user.active) {
      res.status(432).json({message:"Access Denied"})
    } else{
      AdminSchema.find({ active: true })
        .then((users) => {
          const user = req.user;
          res.json({
            users,
            user,
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Error occurred while loading profile",
    });
  }
});

app.get("/leaders", isAuthorized, async (req, res) => {
  try {
    LeaderSchema.find({ active: true })
      .then((users) => {
        console.log(users);
        res.json(users);
      })
      .catch((err) => {
        console.error(err);
      });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Error occurred while loading profile",
    });
  }
});

app.get("/leaders/archive", isAuthorized, async (req, res) => {
  try {
    if((req.user.lvl < 3 || !req.user.lvl) || !req.user.active) {
      res.status(432).json({message:"Access Denied"})
    } else{
      LeaderSchema.find({ active: false })
      .then((users) => {
        console.log(users);
        res.json(users);
      })
      .catch((err) => {
        console.error(err);
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Error occurred while loading profile",
    });
  }
});



app.get("/admins/archive", isAuthorized, async (req, res) => {
  try {
    AdminSchema.find({ active: false })
      .then((users) => {
        res.json(users);
      })
      .catch((err) => {
        console.error(err);
      });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Error occurred while loading profile",
    });
  }
});

function isAuthorized(req, res, next) {
  if (req.user) {
    console.log("User is logged in");
    // console.log(req.user);
    next();
  } else {
    console.log("User is not logged in #3");
    res.redirect(`http://localhost:3000/`);
  }
}
// app.use('/api/checkauth', checkAuth)

// Listen

app.listen(PORT, () => {
  console.log(`Now listening to requests on port ${PORT}`);
});
