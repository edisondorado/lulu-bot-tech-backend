const { AdminSchema, LeaderSchema } = require("../models/DiscordUser");

const router = require("express").Router();

function isAuthorized(req, res, next) {
  if (req.user) {
    console.log("User has permission");
    next();
  } else {
    console.log("User doesn't have permission");
  }
}

router.post("/:id", isAuthorized, async (req, res) => {
  try {
    if (req.body.theme) {
      const idAdmin = req.params.id;
      console.log(idAdmin);
      const userAdmin = await AdminSchema.findOne({ id: idAdmin });
      const userLeader = await LeaderSchema.findOne({ id: idAdmin });
      if(userAdmin) {
        userAdmin.theme = req.body.theme; 
        await userAdmin.save();
      }
      if(userLeader) {
        userLeader.theme = req.body.theme; 
        await userLeader.save();
      }
      res.status(200).json({
        message: "User updated",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error occurred while edit the profile",
    });
  }
});

module.exports = router;
