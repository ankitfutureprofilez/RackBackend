const mongoose = require("mongoose");
const dotenv = require("dotenv");
const logger = require("./utils/Logger");

dotenv.config();

mongoose.connect(process.env.DB_URL, {
   serverSelectionTimeoutMS: 5000,
   autoIndex: false,
   maxPoolSize: 10,
   socketTimeoutMS: 45000,
   family: 4
})
   .then(() => {
      logger.info('MongoDB connected successfully');
   })
   .catch((err) => {
      logger.error('MongoDB CONNECTION ERROR =>>: ', err);
   });
