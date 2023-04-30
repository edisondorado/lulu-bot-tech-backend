const router = require("express").Router();

router.get('/', (req, res) => {
  if (req.user) {
    res.json({
      id: req.user.id,
    });
  } else{
    res.send(300)
  }
});

module.exports = router;
