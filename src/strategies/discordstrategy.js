const DiscordStrategy = require("passport-discord").Strategy;
const passport = require("passport");
const { LeaderSchema, AdminSchema } = require("../models/DiscordUser");

passport.serializeUser((user, done) => {
  console.log("Serialize");
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log("Deserialize");
  const userAdmin = await AdminSchema.findOne({ id: id });
  const userLeader = await LeaderSchema.findOne({ id: id });
  if (userAdmin || userLeader) done(null, userAdmin || userLeader);
});

passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CLIENT_REDIRECT,
      scope: ["identify", "guilds"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userAdmin = await AdminSchema.findOne({ id: profile.id });
        const userLeader = await LeaderSchema.findOne({ id: profile.id });
        if (userAdmin) {
          const user = userAdmin ? AdminSchema : LeaderSchema;
          AdminSchema.findOne({ id: profile.id })
            .then((user) => {
              // Изменяем данные
              user.avatar = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}`;
              user.name_lvl =
                user.lvl === 1
                  ? "Младший модератор"
                  : user.lvl === 2
                  ? "Модератор"
                  : user.lvl === 3
                  ? "Старший модератор"
                  : user.lvl === 4
                  ? "Администратор"
                  : user.lvl === 5
                  ? "Куратор"
                  : user.lvl === 6
                  ? "Заместитель ГА"
                  : user.lvl === 7
                  ? "Главный Администратор"
                  : user.lvl === 8
                  ? "Спец.Администратор"
                  : "Снят";
              user.color_lvl =
                user.lvl === 1
                  ? "#0be4f5"
                  : user.lvl === 2
                  ? "#029eb4"
                  : user.lvl === 3
                  ? "#ffa500"
                  : user.lvl === 4
                  ? "#4040fd"
                  : user.lvl === 5
                  ? "#7900ff"
                  : user.lvl === 6
                  ? "#009b0e"
                  : user.lvl === 7
                  ? "#009b0e"
                  : user.lvl === 8
                  ? "#ff0000"
                  : "#404040";
              return user.save();
            })
            .then(() => {
              console.log("User updated successfully!");
            })
            .catch((err) => {
              console.error(err);
            });
          console.log(
            `User exists like an admin`
          );
          done(null, userAdmin || userLeader);
        } else if (userLeader) {
          LeaderSchema.findOne({ id: profile.id })
            .then((user) => {
              // Изменяем данные
              user.avatar = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}`;
              
              return user.save();
            })
            .then(() => {
              console.log("User updated successfully!");
            })
            .catch((err) => {
              console.error(err);
            });
          console.log(
            `User exists like a leader`
          );
          done(null, userLeader);
        } else {
          console.log("User does not exist.");
          done(null, null);

          // const newUser = await AdminSchema.create({
          //   id: profile.id,
          // });
          // const savedUser = await newUser.save();
          // done(null, savedUser);
        }
      } catch (err) {
        console.log(err);
        done(err, null);
      }
    }
  )
);
