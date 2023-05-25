const mongoose = require("mongoose");
module.exports = mongoose.connect(
  "mongodb+srv://<NAME>:<PASSWORD>.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
