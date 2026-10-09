const mongoose = require('mongoose');
require('dotenv').config();

const clientOptions = {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
  dbName: `StudyNotion`
};

const dbConnect = async () => {
  await mongoose
    .connect(process.env.DATABASE_URL, clientOptions)
    .then(() => {
      console.log('Successfully connected to MongoDB!!!');
    })
    .catch((err) => {
      console.error('Issue in connection with MongoDB Atlas: ', err.message);
      process.exit(1);
    });
};

module.exports = dbConnect;