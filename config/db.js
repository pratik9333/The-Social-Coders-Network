const Mongoose = require("mongoose");

const connectWithDB = () => {
  Mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log(`DB is connected successfully!`);
    })
    .catch((error) => {
      console.log(`DB failed to connect`);
      console.log(error);
    });
};

module.exports = connectWithDB;
