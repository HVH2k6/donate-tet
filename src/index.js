const express = require("express");
const path = require("path");
const expressLayouts = require('express-ejs-layouts');
const route = require('./router/indexRouter');
const connect = require('./service/database.service');

const methodOverride = require("method-override");

const port = process.env.PORT || 3000;
// require("dotenv").config();
const app = express();


connect.connect();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
route(app);



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

