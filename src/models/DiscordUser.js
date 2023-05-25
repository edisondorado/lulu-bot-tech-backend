const mongoose = require("mongoose");

const AdminSchema = mongoose.model("admins", new mongoose.Schema({
  id: String,
  nick: String,
  lvl: Number,
  name_lvl: String,
  color_lvl: String,
  typeAdmin: String,
  addTypeAdmin: String,
  preds: Number,
  blat: Number,
  minusday: Number,
  minusrep: Number,
  plusrep: Number,
  daysinactive: Number,
  from_inactive: String,
  to_inactive: String,
  accessAdm: Boolean,
  reason: String,
  dateSet: String,
  dateUp: String,
  forum: String,
  vk: String,
  avatar: String,
  active: Boolean,
  history: Array,
  theme: String,
  online: Array,
}));

const LeaderSchema = mongoose.model("leaders", new mongoose.Schema({
  id: String,
  nick: String,
  rank: String,
  fraction: String,
  reason: String,
  ustwarn: Number,
  strwarn: Number,
  city: String,
  age: Number,
  dataSet: String,
  forum: String,
  vk: String,
  avatar: String,
  history: Array,
  active: Boolean,
  theme: String,
  discord: String,
  online: Array,
}));

const BlacklistSchema = mongoose.model("blacklist", new mongoose.Schema({
  nick: String,
  forum: String,
  vk: String,
  ip: String,
  email: String,
}));

module.exports = {LeaderSchema, AdminSchema, BlacklistSchema}
