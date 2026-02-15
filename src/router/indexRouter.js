
const homeRouter = require('./HomeRouter'); // Import homeRouter


module.exports = (app) => {
  app.use('/', homeRouter);

};
