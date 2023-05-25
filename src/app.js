require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3002;
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");
const path = require('path');
const cors = require("cors");
const db = require("./database/database");
const mongoose = require("mongoose");

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
const { AdminSchema, LeaderSchema, BlacklistSchema } = require("./models/DiscordUser");

// Session

app.use(
  session({
    secret: "DFGDFGFDGFDGFDGCVBFGGTFDGVG",
    cookie: {
      maxAge: 60000 * 60 * 24,
    },
    saveUninitialized: false,
    resave: false,
    name: "discord.oauth2.lulu",
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);
// Allowing to use API request from different PORTS
const corsOptions = {
  origin: 'https://lulu-bot.tech/',
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes

app.use("/api/auth", authRoute);
app.use("/api/profile/", profileRoute);
app.use("/api/register", registerRoute);
app.use("/api/checkauth", checkAuth);
app.use("/api/edit", editRoute);
app.use("/api/theme/", themeRouter);
app.get("/api/admins", isAuthorized, async (req, res) => {
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

app.get("/api/leaders", isAuthorized, async (req, res) => {
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

app.get("/api/leaders/archive", isAuthorized, async (req, res) => {
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

app.get('/api/download/tools', (req, res) => {
  const filePath = path.join(__dirname, 'Lulu_Tools.rar');

  res.sendFile(filePath, {
    headers: {
      'Content-Disposition': `attachment; filename="Lulu_Tools.rar"`,
    },
  }, (err) => {
    if (err) {
      console.error('Ошибка при отправке файла:', err);
      res.status(500).send('Ошибка сервера');
    }
  });
});

app.get('/api/download/autotools', (req, res) => {
  const filePath = path.join(__dirname, 'AutoLulu_Tools.exe');

  res.sendFile(filePath, {
    headers: {
      'Content-Disposition': `attachment; filename="AutoLulu_Tools.exe"`,
    },
  }, (err) => {
    if (err) {
      console.error('Ошибка при отправке файла:', err);
      res.status(500).send('Ошибка сервера');
    }
  });
});

app.get("/api/admins/archive", isAuthorized, async (req, res) => {
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

app.get("/api/blacklist", isAuthorized, async (req, res) => {
  try{
    BlacklistSchema.find({})
      .then((users) => {
        res.json({
          users
        });
      })
      .catch((err) => {
        console.error(err);
      });
  } catch(e){
    console.log(e);
    res.status(500).json({
      message: "Error occurred while recording blacklist"
    })
  }
});

app.post('/api/blacklist', async (req, res) => {
  try{
    if(req.body.nick && req.body.forum && req.body.vk && req.body.ip && req.body.email){
      const newUser = await BlacklistSchema.create({
        nick: req.body.nick,
        forum: req.body.forum,
        vk: req.body.vk,
        ip: req.body.ip,
        email: req.body.email
      });
      const savedUser = await newUser.save();
      res.status(200).json({
        message: "Success",
        id: req.body.id,
      });
    } else{
      res.json({
        message: "Nick/Forum/VK/IP/Email doesn't exist"
      });
    }
  }catch(e){
    console.log(e);
    res.status(500).json({
      message: "Error occurred while recording blacklist"
    })
  }
});

function isAuthorized(req, res, next) {
  if (req.user) {
    console.log("User is logged in");
    // console.log(req.user);
    next();
  } else {
    console.log("User is not logged in #3");
    res.redirect(`https://lulu-bot.tech`);
  }
}
// app.use('/api/checkauth', checkAuth)

// Listen

app.listen(PORT, () => {
  console.log(`Now listening to requests on port ${PORT}`);
});
