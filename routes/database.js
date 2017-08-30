var express = require('express'),
    path    = require('path'),
    fs      = require('fs'),
    mysql   = require('mysql'),
    router  = express.Router();

var connection = mysql.createPool({
  connectionLimit: 60,
  host: "eu-cdbr-west-01.cleardb.com",
  user: "bb0fcf20a3ed38",
  password: "6e04fb58",
  database: "heroku_8d3437b80905916",
  multipleStatements: true
});

router.post('/games', function (req, res) {
  if(req.query.type == "getAll"){
    connection.query('SELECT * FROM games',function(error,result){
      res.send(result);
    });
  } else if(req.query.type == "getGame"){
    connection.query('SELECT * FROM games WHERE id="'+req.query.data+'" LIMIT 1',function(error,result){
      res.send(result.shift());
    });
  } else{
    var data = JSON.parse(req.query.data);
    connection.query('INSERT INTO games SET ?',data,function(error,result){
      data.id = result.insertId;
      res.send(data);
    });
  }
});

module.exports = router;
