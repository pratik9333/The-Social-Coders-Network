const Mongoose = require("mongoose");

const connectWithDB = () => {
  let dbUrl;
  if (process.env.NODE_ENV === "development") {
    dbUrl = process.env.DATABASE_LOCAL_DB;
  }
  if (process.env.NODE_ENV === "test") {
    dbUrl = process.env.DATABASE_TEST_DB;
  }
  if (process.env.NODE_ENV === "production") {
    dbUrl = process.env.DATABASE_PROD_DB;
  }

  Mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log(`Server is connected to ${process.env.NODE_ENV} DB`);
    })
    .catch((error) => {
      console.log(`DB failed to connect reason - ${error.message}`);
      console.log(`Closing application`);
      process.exit(1); // closing server
    });
};

module.exports = connectWithDB;
