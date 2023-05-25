const { AdminSchema, LeaderSchema } = require("../models/DiscordUser");

const moment = require('moment');
const router = require("express").Router();

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

router.get("/", isAuthorized, async (req, res) => {
  try {
    if (
      (req.user.lvl > 2 && req.user.active) ||
      (req.user.fraction && req.user.active)
    ) {
      console.log("LOADED");
      res.json(req.user);
    } else {
      res.status(423).json({
        messsage: "Access Denied",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Error occurred while checking profile",
    });
  }
});

router.get("/leader/:id", isAuthorized, async (req, res) => {
  try {
    const profileId = req.params.id;
    console.log(req.params.id);
    const userId = await LeaderSchema.findOne({ id: req.user.id }).exec();
    if (req.user.id === profileId && userId) {
      const startDateString = req.user.from_inactive;
      const endDateString = req.user.to_inactive;
      inactive = false;
      if (startDateString && endDateString) {
        const startDate = new Date(startDateString);
        const tempdate = new Date(endDateString);

        const fix = 1 * 24 * 60 * 60 * 1000;
        const endDate = new Date(tempdate.getTime() + fix);
        const currentDate = new Date();

        if (currentDate >= startDate && currentDate <= endDate) {
          inactive = true;
          console.log("INACTIVE");
        } else {
          inactive = false;
          console.log("NOT INACTIVE");
        }
      }
      console.log(req.user.theme);
      res.json({
        idprofile: userId.id,
        selfid: userId.id,
        nick: userId.nick,
        avatar: userId.avatar,
        rank: userId.rank,
        fraction: userId.fraction,
        ustwarn: userId.ustwarn,
        strwarn: userId.strwarn,
        city: userId.city,
        age: userId.age,
        forum: userId.forum,
        vk: userId.vk,
        reason: userId.reason,
        dateSet: userId.dataSet,
        active: userId.active,
        theme: userId.theme,
        discord: userId.discord,
        online: userId.online,
      });
    } else if (req.user.id !== profileId) {
      const userId = await LeaderSchema.findOne({ id: req.params.id }).exec();
      console.log(userId);
      if (userId) {
        const startDateString = userId.from_inactive;
        const endDateString = userId.to_inactive;
        inactive = false;
        if (startDateString && endDateString) {
          const startDate = new Date(startDateString);
          const tempdate = new Date(endDateString);

          const fix = 1 * 24 * 60 * 60 * 1000;
          const endDate = new Date(tempdate.getTime() + fix);
          const currentDate = new Date();

          if (currentDate >= startDate && currentDate <= endDate) {
            inactive = true;
          } else {
            inactive = false;
          }
        }
        req.user.lvl > 2 ? (access = true) : (access = false);
        res.json({
          idprofile: userId.id,
          selfid: req.user.id,
          nick: userId.nick,
          avatar: userId.avatar,
          rank: userId.rank,
          fraction: userId.fraction,
          ustwarn: userId.ustwarn,
          strwarn: userId.strwarn,
          city: userId.city,
          age: userId.age,
          forum: userId.forum,
          vk: userId.vk,
          reason: userId.reason,
          dateSet: userId.dataSet,
          active: userId.active,
          accessFrom: access,
          theme: req.user.theme,
          discord: userId.discord,
          online: userId.online,
        });
      } else res.json({ message: "User not found", user: req.user.id });
    } else {
      console.log("th this error");
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Error occurred while loading profile",
    });
  }
  // res.redirect(`https://lulu-bot.techprofile/${req.user.id}`);
});

router.get("/admin/:id", isAuthorized, async (req, res) => {
  try {
    const profileId = req.params.id;
    console.log(req.params.id);
    const userId = await AdminSchema.findOne({ id: req.user.id }).exec();
    if (req.user.id === profileId && userId) {
      const startDateString = req.user.from_inactive;
      const endDateString = req.user.to_inactive;
      inactive = false;
      if (startDateString && endDateString) {
        const startDate = new Date(startDateString);
        const tempdate = new Date(endDateString);

        const fix = 1 * 24 * 60 * 60 * 1000;
        const endDate = new Date(tempdate.getTime() + fix);
        const currentDate = new Date();

        if (currentDate >= startDate && currentDate <= endDate) {
          inactive = true;
          console.log("INACTIVE");
        } else {
          inactive = false;
          console.log("NOT INACTIVE");
        }
      }
      const now = moment();
      const date = moment(userId.dateUp);
      const days = now.diff(date, 'days');
      console.log(req.user.theme);
      res.json({
        id: userId.id,
        selfid: userId.id,
        nick: userId.nick,
        lvl: userId.lvl,
        inactive: inactive,
        typeAdmin: userId.typeAdmin,
        reason: userId.lvl,
        forum: userId.forum,
        vk: userId.vk,
        avatar: userId.avatar,
        name_lvl: userId.name_lvl,
        lvl_color: userId.color_lvl,
        addTypeAdmin: userId.addTypeAdmin,
        reason: userId.reason,
        preds: userId.preds,
        dateSet: userId.dateSet,
        dateUp: userId.dateUp,
        daysinactive: userId.daysinactive,
        minusday: userId.minusday,
        minusrep: userId.minusrep,
        plusrep: userId.plusrep,
        vk: userId.vk,
        blat: userId.blat,
        accessFrom: userId.accessAdm,
        theme: userId.theme,
        daysUp: days,
        online: userId.online,
      });
    } else if (req.user.id !== profileId) {
      if (req.user.accessAdm === true || req.user.typeAdmin === "ГС Гос.Структур" || req.user.typeAdmin === "ЗГС Гос.Структур") {
        const userId = await AdminSchema.findOne({ id: req.params.id }).exec();

        if (userId) {
          const startDateString = userId.from_inactive;
          const endDateString = userId.to_inactive;
          inactive = false;
          if (startDateString && endDateString) {
            const startDate = new Date(startDateString);
            const tempdate = new Date(endDateString);

            const fix = 1 * 24 * 60 * 60 * 1000;
            const endDate = new Date(tempdate.getTime() + fix);
            const currentDate = new Date();

            if (currentDate >= startDate && currentDate <= endDate) {
              inactive = true;
            } else {
              inactive = false;
            }
          }
          const now = moment();
          const date = moment(userId.dateUp);
          const days = now.diff(date, 'days');
          console.log(days);
          res.json({
            id: userId.id,
            selfid: req.user.id,
            nick: userId.nick,
            inactive: inactive,
            lvl: userId.lvl,
            typeAdmin: userId.typeAdmin,
            reason: userId.lvl,
            forum: userId.forum,
            vk: userId.vk,
            avatar: userId.avatar,
            name_lvl: userId.name_lvl,
            lvl_color: userId.color_lvl,
            addTypeAdmin: userId.addTypeAdmin,
            reason: userId.reason,
            preds: userId.preds,
            dateSet: userId.dateSet,
            dateUp: userId.dateUp,
            daysinactive: userId.daysinactive,
            minusday: userId.minusday,
            minusrep: userId.minusrep,
            plusrep: userId.plusrep,
            vk: userId.vk,
            blat: userId.blat,
            accessAdm: userId.accessAdm,
            accessFrom: req.user.accessAdm === true ? true : req.user.typeAdmin === "ГС Гос.Структур" ? true : req.user.typeAdmin === "ЗГС Гос.Структур" ? true : false,
            theme: req.user.theme,
            daysUp: days,
            online: userId.online,
          });
        } else res.json({ message: "User not found", user: req.user.id });
      } else {
        res.json({ message: "User not found", user: req.user.id });
      }
    }
    console.log(req.user);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Error occurred while loading profile",
    });
  }
  // res.redirect(`https://lulu-bot.techprofile/${req.user.id}`);
});

router.get("/admin/", isAuthorized, async (req, res) => {
  try {
    res.json(req.user);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Error occurred while loading profile",
    });
  }
  // res.redirect(`https://lulu-bot.techprofile/${req.user.id}`);
});

router.get("/leader/", isAuthorized, async (req, res) => {
  try {
    res.json(req.user);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Error occurred while loading profile",
    });
  }
  // res.redirect(`https://lulu-bot.techprofile/${req.user.id}`);
});

router.get("/leader/history/:id", isAuthorized, async (req, res) => {
  try {
    const idLeader = req.params.id;
    if (idLeader) {
      LeaderSchema.findOne({ id: idLeader })
        .then((leader) => {
          if (!leader) {
            res.status(404).json({ message: "Leader not found" });
          } else {
            res.json(leader.history);
          }
        })
        .catch((err) => {
          console.log(err);
          res
            .status(500)
            .json({ message: "Error occurred while getting history" });
        });
    } else {
      res.status(500).json({
        message: "User doesn't exist",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Error occurred while edit the profile",
    });
  }
});

router.get("/admin/history/:id", isAuthorized, async (req, res) => {
  try {
    const idAdmin = req.params.id;
    if (idAdmin) {
      AdminSchema.findOne({ id: idAdmin })
        .then((admin) => {
          if (!admin) {
            res.status(404).json({ message: "Admin not found" });
          } else {
            res.json(admin.history);
          }
        })
        .catch((err) => {
          console.log(err);
          res
            .status(500)
            .json({ message: "Error occurred while getting history" });
        });
    } else {
      res.status(500).json({
        message: "User doesn't exist",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Error occurred while edit the profile",
    });
  }
});

module.exports = router;
