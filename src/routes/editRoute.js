const { AdminSchema, LeaderSchema } = require("../models/DiscordUser");

const router = require("express").Router();
const axios = require('axios');

function isAuthorized(req, res, next) {
  if (req.user && req.user.accessAdm === true || req.user.typeAdmin === "ГС Гос.Структур" || req.user.typeAdmin === "ЗГС Гос.Структур") {
    console.log("User has permission");
    next();
  } else {
    console.log("User doesn't have permission");
  }
}


const webhookUrl = 'https://discord.com/api/webhooks/1107355878191014018/RR6a-MkSwskWsyzjCtZUGiZkhho3';

async function sendMessage(content) {
  try {
    const response = await axios.post(webhookUrl, {
      content: content
    });
    console.log('Message sent successfully');
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

// sendMessage('Hello, Discord!').catch(console.error);

function isAuthorizedLeader(req, res, next) {
  if (req.user && req.user.lvl > 2 && req.user.active) {
    console.log("User has permission");
    next();
  } else {
    console.log("User doesn't have permission");
  }
}

router.post("/leader/:id", isAuthorizedLeader, async (req, res) => {
  try {
    const idLeader = req.params.id;
    if (idLeader) {
      LeaderSchema.findOne({ id: idLeader })
        .then((user) => {
          console.log(req.body);
          const currentDate = new Date();
          const options = {
            timeZone: "Europe/Moscow",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          };
          const moscowTime = currentDate.toLocaleString("ru-RU", options);
          const time = moscowTime.replace(",", "");

          if (req.body.rank !== "") {
            const newItem = {
              text: `${req.user.typeAdmin} ${req.user.nick} установил должность "${req.body.rank}" Игроку ${user.nick}`,
              time: time,
              type: "Изменение должности",
            };
            LeaderSchema.findOneAndUpdate(
              { id: idLeader },
              { $push: { history: newItem } },
              { new: true }
            )
              .exec()
              .then((doc) => {
                console.log(doc);
              })
              .catch((err) => {
                console.log(err);
              });

            user.rank = req.body.rank;
            user.active = true;
          }

          if(req.body.fraction !== ""){
            const newItem = {
              text: `${req.user.typeAdmin} ${req.user.nick} установил фракцию "${req.body.fraction}" Игроку ${user.nick}`,
              time: time,
              type: "Изменение фракции",
            };
            LeaderSchema.findOneAndUpdate(
              { id: idLeader },
              { $push: { history: newItem } },
              { new: true }
            )
              .exec()
              .then((doc) => {
                console.log(doc);
              })
              .catch((err) => {
                console.log(err);
              });

            user.fraction = req.body.fraction;
            user.active = true;
          }

          if(req.body.reason !== ""){
            const newItem = {
              text: `${req.user.typeAdmin} ${req.user.nick} установил причину назначения "${req.body.reason}" Игроку ${user.nick}`,
              time: time,
              type: "Изменение причины постановления",
            };
            LeaderSchema.findOneAndUpdate(
              { id: idLeader },
              { $push: { history: newItem } },
              { new: true }
            )
              .exec()
              .then((doc) => {
                console.log(doc);
              })
              .catch((err) => {
                console.log(err);
              });

            user.reason = req.body.reason;
            user.active = true;
          }

          if(req.body.dateSet !== ""){
            const newItem = {
              text: `${req.user.typeAdmin} ${req.user.nick} установил дату назначения "${req.body.dateSet}" Игроку ${user.nick}`,
              time: time,
              type: "Смена даты назначения",
            };
            LeaderSchema.findOneAndUpdate(
              { id: idLeader },
              { $push: { history: newItem } },
              { new: true }
            )
              .exec()
              .then((doc) => {
                console.log(doc);
              })
              .catch((err) => {
                console.log(err);
              });

            user.dataSet = req.body.dateSet;
            user.active = true;
          }

          if(req.body.resign !== ""){
            const newItem = {
              text: `${req.user.typeAdmin} ${req.user.nick} снял Игрока ${user.nick} по причине: ${req.body.resign}`,
              time: time,
              type: "Снятие лидера",
            };
            LeaderSchema.findOneAndUpdate(
              { id: idLeader },
              { $push: { history: newItem } },
              { new: true }
            )
              .exec()
              .then((doc) => {
                console.log(doc);
              })
              .catch((err) => {
                console.log(err);
              });

            user.active = false;
          }

          if(req.body.strwarn !== ""){
            const newItem = {
              text: `${req.user.typeAdmin} ${req.user.nick} выдал строгий выговор Игроку ${user.nick} по причине: ${req.body.strwarn}`,
              time: time,
              type: "Выдача строгих выговоров",
            };
            LeaderSchema.findOneAndUpdate(
              { id: idLeader },
              { $push: { history: newItem } },
              { new: true }
            )
              .exec()
              .then((doc) => {
                console.log(doc);
              })
              .catch((err) => {
                console.log(err);
              });

            user.strwarn = user.strwarn + 1
          }

          if(req.body.ustwarn !== ""){
            const newItem = {
              text: `${req.user.typeAdmin} ${req.user.nick} выдал устный выговор Игроку ${user.nick} по причине: ${req.body.ustwarn}`,
              time: time,
              type: "Выдача устных выговоров",
            };
            LeaderSchema.findOneAndUpdate(
              { id: idLeader },
              { $push: { history: newItem } },
              { new: true }
            )
              .exec()
              .then((doc) => {
                console.log(doc);
              })
              .catch((err) => {
                console.log(err);
              });

            user.ustwarn = user.ustwarn + 1;
          }

          if(req.body.unstrwarn !== "" && user.strwarn !== 0){
            const newItem = {
              text: `${req.user.typeAdmin} ${req.user.nick} снял строгий выговор Игроку ${user.nick} по причине: ${req.body.unstrwarn}`,
              time: time,
              type: "Снятие строгих выговоров",
            };
            LeaderSchema.findOneAndUpdate(
              { id: idLeader },
              { $push: { history: newItem } },
              { new: true }
            )
              .exec()
              .then((doc) => {
                console.log(doc);
              })
              .catch((err) => {
                console.log(err);
              });

            user.strwarn = user.strwarn - 1;
          }
          
          if(req.body.unustwarn !== "" && user.ustwarn !== 0){
            const newItem = {
              text: `${req.user.typeAdmin} ${req.user.nick} снял устный выговор Игроку ${user.nick} по причине: ${req.body.unstrwarn}`,
              time: time,
              type: "Снятие устных выговоров",
            };
            LeaderSchema.findOneAndUpdate(
              { id: idLeader },
              { $push: { history: newItem } },
              { new: true }
            )
              .exec()
              .then((doc) => {
                console.log(doc);
              })
              .catch((err) => {
                console.log(err);
              });

            user.ustwarn = user.ustwarn - 1;
          }

          if(req.body.nick !== ""){
            const newItem = {
              text: `${req.user.typeAdmin} ${req.user.nick} изменил никнейм ${user.nick} на ${req.body.nick}`,
              time: time,
              type: "Смена никнейма",
            };
            LeaderSchema.findOneAndUpdate(
              { id: idLeader },
              { $push: { history: newItem } },
              { new: true }
            )
              .exec()
              .then((doc) => {
                console.log(doc);
              })
              .catch((err) => {
                console.log(err);
              });

            user.nick = req.body.nick;
          }

          if(req.body.age){
            const newItem = {
              text: `${req.user.typeAdmin} ${req.user.nick} изменил возраст Игроку ${user.nick} с ${user.age} на ${req.body.age}`,
              time: time,
              type: "Смена возраста",
            };
            LeaderSchema.findOneAndUpdate(
              { id: idLeader },
              { $push: { history: newItem } },
              { new: true }
            )
              .exec()
              .then((doc) => {
                console.log(doc);
              })
              .catch((err) => {
                console.log(err);
              });

            user.age = req.body.age
          }

          if(req.body.city !== ""){
            const newItem = {
              text: `${req.user.typeAdmin} ${req.user.nick} изменил город Игроку ${user.nick} с ${user.city} на ${req.body.city}`,
              time: time,
              type: "Смена города",
            };
            LeaderSchema.findOneAndUpdate(
              { id: idLeader },
              { $push: { history: newItem } },
              { new: true }
            )
              .exec()
              .then((doc) => {
                console.log(doc);
              })
              .catch((err) => {
                console.log(err);
              });

            user.city = req.body.city;
          }

          if(req.body.discord !== ""){
            const newItem = {
              text: `${req.user.typeAdmin} ${req.user.nick} изменил дискорд логин Игроку ${user.nick} с ${user.discord} на ${req.body.discord}`,
              time: time,
              type: "Смена дискорда",
            };
            LeaderSchema.findOneAndUpdate(
              { id: idLeader },
              { $push: { history: newItem } },
              { new: true }
            )
              .exec()
              .then((doc) => {
                console.log(doc);
              })
              .catch((err) => {
                console.log(err);
              });

            user.discord = req.body.discord;
          }

          if(req.body.forum !== ""){
            const newItem = {
              text: `${req.user.typeAdmin} ${req.user.nick} изменил Форумный Аккаунт игроку ${user.nick} с ${user.forum} на ${req.body.forum}`,
              time: time,
              type: "Смена форум",
            };
            LeaderSchema.findOneAndUpdate(
              { id: idLeader },
              { $push: { history: newItem } },
              { new: true }
            )
              .exec()
              .then((doc) => {
                console.log(doc);
              })
              .catch((err) => {
                console.log(err);
              });

            user.forum = req.body.forum;
          }
          if(req.body.vk !== ""){
            const newItem = {
              text: `${req.user.typeAdmin} ${req.user.nick} изменил ВК Аккаунт игроку ${user.nick} с ${user.vk} на ${req.body.vk}`,
              time: time,
              type: "Смена форум",
            };
            LeaderSchema.findOneAndUpdate(
              { id: idLeader },
              { $push: { history: newItem } },
              { new: true }
            )
              .exec()
              .then((doc) => {
                console.log(doc);
              })
              .catch((err) => {
                console.log(err);
              });

            user.vk = req.body.vk;
          }
          // accessAdm: Bolean,
          // active: Boolean,
          return user.save();
        })
        .then(() => {
          console.log("User updated successfully!");
          res.status(200).json({
            message: "User updated",
          });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({
            message: "Error occurred while edit the profile",
          });
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
router.post("/admin/:id", isAuthorized, async (req, res) => {
  try {
    const idAdmin = req.params.id;
    if (idAdmin) {
      AdminSchema.findOne({ id: idAdmin })
        .then((user) => {
          console.log(req.body);
          const currentDate = new Date();
          const options = {
            timeZone: "Europe/Moscow",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          };
          const moscowTime = currentDate.toLocaleString("ru-RU", options);
          const time = moscowTime.replace(",", "");
          if(req.user.accessAdm){
            if (parseInt(req.body.lvl)) {
              user.lvl = parseInt(req.body.lvl);
              user.active = true;
              user.name_lvl =
                parseInt(req.body.lvl) === 1
                  ? "Младший модератор"
                  : parseInt(req.body.lvl) === 2
                  ? "Модератор"
                  : parseInt(req.body.lvl) === 3
                  ? "Старший модератор"
                  : parseInt(req.body.lvl) === 4
                  ? "Администратор"
                  : parseInt(req.body.lvl) === 5
                  ? "Куратор"
                  : parseInt(req.body.lvl) === 6
                  ? "Заместитель ГА"
                  : parseInt(req.body.lvl) === 7
                  ? "Главный Администратор"
                  : parseInt(req.body.lvl) === 8
                  ? "Спец.Администратор"
                  : "Игрок";
              user.color_lvl =
                parseInt(req.body.lvl) === 1
                  ? "#0be4f5"
                  : parseInt(req.body.lvl) === 2
                  ? "#029eb4"
                  : parseInt(req.body.lvl) === 3
                  ? "#ffa500"
                  : parseInt(req.body.lvl) === 4
                  ? "#4040fd"
                  : parseInt(req.body.lvl) === 5
                  ? "#7900ff"
                  : parseInt(req.body.lvl) === 6
                  ? "#009b0e"
                  : parseInt(req.body.lvl) === 7
                  ? "#009b0e"
                  : parseInt(req.body.lvl) === 8
                  ? "#ff0000"
                  : "#404040";
              const now = new Date();
              const year = now.getFullYear();
              const month = String(now.getMonth() + 1).padStart(2, '0'); // добавляем ведущий ноль, если месяц < 10
              const day = String(now.getDate()).padStart(2, '0'); // добавляем ведущий ноль, если день < 10
              user.dateUp = `${year}-${month}-${day}`;
              user.minusday = 0;
              user.plusrep = 0;
              user.minusrep = 0;
              user.daysinactive = 0;
              const newItem = {
                text: `${req.user.typeAdmin} ${req.user.nick} установил уровень ${req.body.lvl} Админстратору ${user.nick}`,
                time: time,
                type: "Изменение уровня",
              };
              sendMessage(`\`[✅]\` <@${req.user.id}>\` установил уровень "${req.body.lvl}" админстратору \`<@${user.id}>\`.\``).catch(console.error);
              AdminSchema.findOneAndUpdate(
                { id: idAdmin },
                { $push: { history: newItem } },
                { new: true }
              )
                .exec()
                .then((doc) => {
                  console.log(doc);
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            if (req.body.typeAdmin !== "") {
              user.typeAdmin = req.body.typeAdmin;
              const newItem = {
                text: `${req.user.typeAdmin} ${req.user.nick} установил должность "${req.body.typeAdmin}" Админстратору ${user.nick}`,
                time: time,
                type: "Смена должности",
              };
              AdminSchema.findOneAndUpdate(
                { id: idAdmin },
                { $push: { history: newItem } },
                { new: true }
              )
                .exec()
                .then((doc) => {
                  console.log(doc);
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            if (req.body.addTypeAdmin) {
              user.addTypeAdmin = req.body.addTypeAdmin;
              const newItem = {
                text: `${req.user.typeAdmin} ${req.user.nick} установил доп.должность "${req.body.addTypeAdmin}" Админстратору ${user.nick}`,
                time: time,
                type: "Смена доп.должности",
              };
              AdminSchema.findOneAndUpdate(
                { id: idAdmin },
                { $push: { history: newItem } },
                { new: true }
              )
                .exec()
                .then((doc) => {
                  console.log(doc);
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            if (req.body.pluspred) {
              user.preds = parseInt(user.preds) + 1;
              user.plusrep = parseInt(user.plusrep) + 500;
              const newItem = {
                text: `${req.user.typeAdmin} ${req.user.nick} выдал предупреждение ${user.nick} по причине: ${req.body.pluspred}`,
                time: time,
                type: "Выдача выговора",
              };
              sendMessage(`\`[✅]\` <@${req.user.id}>\` выдал предупреждение \`<@${user.id}>\` по причине: ${req.body.pluspred}.\``).catch(console.error);
              AdminSchema.findOneAndUpdate(
                { id: idAdmin },
                { $push: { history: newItem } },
                { new: true }
              )
                .exec()
                .then((doc) => {
                  console.log(doc);
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            if (req.body.minuspred && user.preds !== 0) {
              user.preds = parseInt(user.preds) - 1;
              const newItem = {
                text: `${req.user.typeAdmin} ${req.user.nick} снял предупреждение ${user.nick} по причине: ${req.body.minuspred}`,
                time: time,
                type: "Снятие выговора",
              };
              sendMessage(`\`[✅]\` <@${req.user.id}>\` снял предупреждение \`<@${user.id}>\` по причине: ${req.body.minuspred}.\``).catch(console.error);
              AdminSchema.findOneAndUpdate(
                { id: idAdmin },
                { $push: { history: newItem } },
                { new: true }
              )
                .exec()
                .then((doc) => {
                  console.log(doc);
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            if (req.body.plusblat) {
              user.blat = parseInt(user.blat) + parseInt(req.body.plusblat);
              const newItem = {
                text: `${req.user.typeAdmin} ${req.user.nick} выдал блатные дни "${req.body.plusblat}" Админстратору ${user.nick}`,
                time: time,
                type: "Выдача блатного дня",
              };
              AdminSchema.findOneAndUpdate(
                { id: idAdmin },
                { $push: { history: newItem } },
                { new: true }
              )
                .exec()
                .then((doc) => {
                  console.log(doc);
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            if (req.body.minusblat && user.blat !== 0) {
              user.blat = parseInt(user.blat) - parseInt(req.body.minusblat);
              const newItem = {
                text: `${req.user.typeAdmin} ${req.user.nick} забрал блатной день "${req.body.minusblat}" у Админстратора ${user.nick}`,
                time: time,
                type: "Снятие блатного дня",
              };
              AdminSchema.findOneAndUpdate(
                { id: idAdmin },
                { $push: { history: newItem } },
                { new: true }
              )
                .exec()
                .then((doc) => {
                  console.log(doc);
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            if (req.body.giveminusday) {
              user.minusday =
                parseInt(user.minusday) + parseInt(req.body.giveminusday);
              const newItem = {
                text: `${req.user.typeAdmin} ${req.user.nick} выдал минус дни "${req.body.giveminusday}" Админстратору ${user.nick}`,
                time: time,
                type: "Выдача минус дней",
              };
              AdminSchema.findOneAndUpdate(
                { id: idAdmin },
                { $push: { history: newItem } },
                { new: true }
              )
                .exec()
                .then((doc) => {
                  console.log(doc);
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            if (req.body.takeminusday) {
              user.minusday =
                parseInt(user.minusday) - parseInt(req.body.takeminusday);
              const newItem = {
                text: `${req.user.typeAdmin} ${req.user.nick} забрал минус дни "${req.body.takeminusday}" у Админстратора ${user.nick}`,
                time: time,
                type: "Снятие минус дней",
              };
              AdminSchema.findOneAndUpdate(
                { id: idAdmin },
                { $push: { history: newItem } },
                { new: true }
              )
                .exec()
                .then((doc) => {
                  console.log(doc);
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            if (req.body.giveplusrep) {
              user.plusrep =
                parseInt(user.plusrep) + parseInt(req.body.giveplusrep);
              const newItem = {
                text: `${req.user.typeAdmin} ${req.user.nick} выдал плюс репутацию "${req.body.giveplusrep}" Админстратору ${user.nick}`,
                time: time,
                type: "Выдача плюс к репутации",
              };
              AdminSchema.findOneAndUpdate(
                { id: idAdmin },
                { $push: { history: newItem } },
                { new: true }
              )
                .exec()
                .then((doc) => {
                  console.log(doc);
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            if (req.body.takeplusrep) {
              user.plusrep =
                parseInt(user.plusrep) - parseInt(req.body.takeplusrep);
              const newItem = {
                text: `${req.user.typeAdmin} ${req.user.nick} забрал плюс репутацию "${req.body.takeplusrep}" у Админстратора ${user.nick}`,
                time: time,
                type: "Снятие плюс к репутации",
              };
              AdminSchema.findOneAndUpdate(
                { id: idAdmin },
                { $push: { history: newItem } },
                { new: true }
              )
                .exec()
                .then((doc) => {
                  console.log(doc);
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            if (req.body.giveminusrep) {
              user.minusrep =
                parseInt(user.minusrep) + parseInt(req.body.giveminusrep);
              const newItem = {
                text: `${req.user.typeAdmin} ${req.user.nick} выдал минус репутацию "${req.body.giveminusrep}" Админстратору ${user.nick}`,
                time: time,
                type: "Выдача минус к репутации",
              };
              AdminSchema.findOneAndUpdate(
                { id: idAdmin },
                { $push: { history: newItem } },
                { new: true }
              )
                .exec()
                .then((doc) => {
                  console.log(doc);
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            if (req.body.takeminusrep) {
              user.minusrep =
                parseInt(user.minusrep) - parseInt(req.body.takeminusrep);
              const newItem = {
                text: `${req.user.typeAdmin} ${req.user.nick} забрал минус репутацию "${req.body.takeminusrep}" у Админстратора ${user.nick}`,
                time: time,
                type: "Снятие минус к репутации",
              };
              AdminSchema.findOneAndUpdate(
                { id: idAdmin },
                { $push: { history: newItem } },
                { new: true }
              )
                .exec()
                .then((doc) => {
                  console.log(doc);
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            if (req.body.takeinactive) {
              user.daysinactive =
                parseInt(user.daysinactive) - parseInt(req.body.takeinactive);
              const newItem = {
                text: `${req.user.typeAdmin} ${req.user.nick} снял дни неактива "${req.body.takeinactive}" у Админстратора ${user.nick}`,
                time: time,
                type: "Снятие дней неактива",
              };
              AdminSchema.findOneAndUpdate(
                { id: idAdmin },
                { $push: { history: newItem } },
                { new: true }
              )
                .exec()
                .then((doc) => {
                  console.log(doc);
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            if (req.body.from_inactive !== "" && req.body.to_inactive !== "") {
              const startDateString = req.body.from_inactive;
              const endDateString = req.body.to_inactive;
  
              const startDate = new Date(startDateString);
              const endDate = new Date(endDateString);
  
              const timeDifference = endDate.getTime() - startDate.getTime();
              const dayDifference = Math.round(
                (timeDifference + 1000*60*60*24) / (1000 * 60 * 60 * 24)
              );
              user.from_inactive = startDateString;
              user.to_inactive = endDateString;
              user.daysinactive = parseInt(user.daysinactive) + parseInt(dayDifference);
              const newItem = {
                text: `${req.user.typeAdmin} ${req.user.nick} установил неактив Админстратору ${user.nick} (С ${startDateString} по ${endDateString})`,
                time: time,
                type: "Выдача неактива",
              };
              sendMessage(`\`[✅]\` <@${req.user.id}>\` выдал неактив \`<@${user.id}>\` (С ${startDateString} по ${endDateString})\``).catch(console.error);
              AdminSchema.findOneAndUpdate(
                { id: idAdmin },
                { $push: { history: newItem } },
                { new: true }
              )
                .exec()
                .then((doc) => {
                  console.log(doc);
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            if (req.body.stopinactive !== "") {
              const endDate = new Date(user.to_inactive);
              const currentDate = new Date();
  
              const timeDiff = endDate.getTime() - currentDate.getTime();
              const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
              user.daysinactive = user.daysinactive - diffDays;
              user.from_inactive = "0";
              user.to_inactive = "0";
              const newItem = {
                text: `${req.user.typeAdmin} ${req.user.nick} заранее закончил неактив Админстратору ${user.nick} по причине: ${req.body.stopinactive}`,
                time: time,
                type: "Отмена актуального неактива",
              };
              AdminSchema.findOneAndUpdate(
                { id: idAdmin },
                { $push: { history: newItem } },
                { new: true }
              )
                .exec()
                .then((doc) => {
                  console.log(doc);
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            if (req.body.active !== "") {
              const newItem = {
                text: `${req.user.typeAdmin} ${req.user.nick} снял Админстратора ${user.nick} по причине: ${req.body.active}`,
                time: time,
                type: "Снятие с администратора",
              };
              sendMessage(`\`[✅]\` <@${req.user.id}>\` снял администратора \`<@${user.id}>\`(${user.nick}) по причине: ${req.body.active}\``).catch(console.error);
              AdminSchema.findOneAndUpdate(
                { id: idAdmin },
                { $push: { history: newItem } },
                { new: true }
              )
                .exec()
                .then((doc) => {
                  console.log(doc);
                })
                .catch((err) => {
                  console.log(err);
                });
              user.active = false;
              user.name_lvl = "Снят";
              user.color_lvl = "#404040";
            }
            return user.save();
          } else if (req.user.typeAdmin === "ГС Гос.Структур" || req.user.typeAdmin === "ЗГС Гос.Структур"){
            if (req.body.typeAdmin !== "") {
              user.typeAdmin = req.body.typeAdmin;
              const newItem = {
                text: `${req.user.typeAdmin} ${req.user.nick} установил должность "${req.body.typeAdmin}" Админстратору ${user.nick}`,
                time: time,
                type: "Смена должности",
              };
              AdminSchema.findOneAndUpdate(
                { id: idAdmin },
                { $push: { history: newItem } },
                { new: true }
              )
                .exec()
                .then((doc) => {
                  console.log(doc);
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            if (req.body.addTypeAdmin) {
              user.addTypeAdmin = req.body.addTypeAdmin;
              const newItem = {
                text: `${req.user.typeAdmin} ${req.user.nick} установил доп.должность "${req.body.addTypeAdmin}" Админстратору ${user.nick}`,
                time: time,
                type: "Смена доп.должности",
              };
              AdminSchema.findOneAndUpdate(
                { id: idAdmin },
                { $push: { history: newItem } },
                { new: true }
              )
                .exec()
                .then((doc) => {
                  console.log(doc);
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            return user.save();
          }
          // accessAdm: Bolean,
          // active: Boolean,
        })
        .then(() => {
          console.log("User updated successfully!");
          res.status(200).json({
            message: "User updated",
          });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({
            message: "Error occurred while edit the profile",
          });
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
