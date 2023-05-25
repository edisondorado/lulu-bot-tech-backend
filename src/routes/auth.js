const router = require("express").Router();
const passport = require("passport");

router.get("/", passport.authenticate("discord"));
router.get("/logout", (req, res) => {
  if (req.user) {
    req.logout(function (err) {
      if (err) {
        console.error(err);
      }
      res.redirect("https://lulu-bot.tech/");
    });
  } else {
    res.redirect("https://lulu-bot.tech/");
  }
});

router.get(
  "/redirect",
  passport.authenticate("discord", {
    failureRedirect: "/forbidden",
  }),
  (req, res) => {
    if (req.user.lvl && req.user.active === true) {
      res.redirect(`https://lulu-bot.tech/profile/admin/${req.user.id}`);
    } else if (req.user.fraction && req.user.active == true) {
      res.redirect(`https://lulu-bot.tech/profile/leader/${req.user.id}`);
    } else {
      res.redirect("https://lulu-bot.tech/forbidden/");
    }
  }
);

module.exports = router;
