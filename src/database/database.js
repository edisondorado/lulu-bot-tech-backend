const mongoose = require("mongoose");
module.exports = mongoose.connect(
  "mongodb+srv://lulu-bot-tech:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
