var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : "localhost",
  port     : "3306" ,
  user     : "dario",
  password : "1234",
  database : "acamicamovie"
});



module.exports = connection;

