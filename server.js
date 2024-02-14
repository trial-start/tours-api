const dotenv = require('dotenv');
const mongoose = require('mongoose');

// const Tour = require('./models/tourModels');

// uncaughtException is emitted when an error is thrown but not caught
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const uri = process.env.DATABASE;
// console.log(process.env);

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
};
mongoose.connect(uri, options).then(conn => {
  // console.log(conn.connections);
  console.log('Connected to MongoDB');
});
//.catch(err => console.error('Connection error:', err));

// const testTour = new Tour({
//   name: 'The sample ',
//   rating: 4.7,
//   price: 497
// });

// testTour
//   .save()
//   .then(doc => {
//     console.log(doc);
//   })
//   .catch(err => {
//     console.log('ERROR :', err);
//   });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// unhandledRejection is emitted when a Promise is rejected but there is no catch handler
process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
