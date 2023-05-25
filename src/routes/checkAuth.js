const router = require("express").Router();

router.get('/', (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      userId: req.user.id,
      isAdmin: req.user.lvl > 0 && req.user.active ? true : false
    });
  } else{
    res.send(300)
  }
});

module.exports = router;
