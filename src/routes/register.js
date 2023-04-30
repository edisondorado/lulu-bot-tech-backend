const { AdminSchema, LeaderSchema } = require("../models/DiscordUser");

const router = require("express").Router();

function doesHavePermissionAdm(req, res, next) {
  if (req.user && req.user.accessAdm === true) {
    next();
  } else {
    res.redirect("/");
  }
}

function doesHavePermissionLead(req, res, next) {
  if (req.user && req.user.lvl > 2) {
    next();
  } else {
    res.redirect("/");
  }
}

router.post("/admin", doesHavePermissionAdm, async (req, res) => {
  if (
    req.body.nick &&
    req.body.id &&
    req.body.lvl &&
    req.body.reason &&
    req.body.date &&
    req.body.forum &&
    req.body.vk
  ) {
    try {
      const userAdmin = await AdminSchema.findOne({ id: req.body.id });
      if (userAdmin) {
        res.json({
          message: "User already exist",
        });
      } else {
        req.body.lvl === "1" ? (tempTypeAdmin = "Хелпер", tempNameLvl = "Младший модератор", tempColorLvl = "#0be4f5") :
        req.body.lvl === "2" ? (tempTypeAdmin = "Хелпер", tempNameLvl = "Модератор", tempColorLvl = "#029eb4") :
        req.body.lvl === "3" ? (tempTypeAdmin = "Репорт", tempNameLvl = "Старший модератор", tempColorLvl = "#ffa500") :
        req.body.lvl === "4" ? (tempTypeAdmin = "Репорт", tempNameLvl = "Администратор", tempColorLvl = "#4040fd") :
        req.body.lvl === "5" ? (tempTypeAdmin = "Репорт", tempNameLvl = "Куратор", tempColorLvl = "#7900ff") :
        (tempTypeAdmin = "Снят", tempNameLvl = "Снят", tempColorLvl = "#404040")
        const newUser = await AdminSchema.create({
          id: req.body.id,
          nick: req.body.nick,
          lvl: req.body.lvl,
          reason: req.body.reason,
          dateSet: req.body.date,
          dateUp: req.body.date,
          forum: req.body.forum,
          vk: req.body.vk,
          active: true,
          accessAdm: false,
          typeAdmin: tempTypeAdmin,
          name_lvl: tempNameLvl,
          color_lvl: tempColorLvl,
          addTypeAdmin: "-",
          daysinactive: "0",
          minusday: "0",
          minusrep: '0',
          plusrep: "0",
          preds: "0",
          from_inactive: "0",
          to_inactive: "0",
          blat: "0"
        });
        const savedUser = await newUser.save();
        res.status(200).json({
          message: "Success",
          id: req.body.id,
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Occurred error while handling create profile for new admin.",
      });
    }
  } else {
    res.status(400).json({
      message: "Request doesn't include nick/id/lvl/reason/date/forum/vk",
    });
  }
});

router.post("/leader", doesHavePermissionLead, async (req, res) => {
    if (
        req.body.nick &&
        req.body.id &&
        req.body.rank &&
        req.body.fraction &&
        req.body.reason &&
        req.body.date &&
        req.body.forum &&
        req.body.vk
      ) {
        try {
          const userLeader = await LeaderSchema.findOne({ id: req.body.id });
          if (userLeader) {
            res.status(400).json({
              message: "User already exist",
            });
          } else {
            const nowDay = new Date()
            const newUser = await LeaderSchema.create({
              id: req.body.id,
              nick: req.body.nick,
              rank: req.body.rank,
              fraction: req.body.fraction,
              reason: req.body.reason,
              date: req.body.date,
              forum: req.body.forum,
              vk: req.body.vk,
              dataSet: req.body.date,
              avatar: "",
              ustwarn: 0,
              strwarn: 0,
              city: "Неизвестно",
              age: 0,
              active: true,
              theme: "1",
              discord: "Неизвестно"
            });
            const savedUser = await newUser.save();
            res.status(200).json({
              message: "Success",
            });
          }
        } catch (err) {
          console.log(err);
          res.status(500).json({
            message: "Occurred error while handling create profile for new leader.",
          });
        }
      } else {
        res.status(400).json({
          message: "Request doesn't include nick/id/lvl/reason/date/forum/vk",
        });
      }
});

module.exports = router;
