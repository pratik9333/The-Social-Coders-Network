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
      console.log(`DB failed to connect reason - ${error.message}`);
      console.log(`Closing application`);
      process.exit(1); // closing server
    });
};

module.exports = connectWithDB;
