var express = require('express'),
    path    = require('path'),
    fs      = require('fs'),
    mysql   = require('mysql'),
    router  = express.Router();

var connection = mysql.createPool({
  connectionLimit: 60,
  host: process.env.HOST || "eu-cdbr-west-01.cleardb.com",
  user: process.env.USER || "bb0fcf20a3ed38",
  password: process.env.PASSWORD || "6e04fb58",
  database: process.env.DATABASE || "heroku_8d3437b80905916",
  multipleStatements: true
});

router.post('/games', function (req, res) {
  if(req.query.type == "getAll"){
    connection.query('SELECT * FROM games',function(error,result){
      res.send(result);
    });
  } else if(req.query.type == "getGame"){
    connection.query('SELECT * FROM games WHERE id="'+req.query.data+'" LIMIT 1',function(error,result){
      var game_content = result.shift();
      connection.query('SELECT * FROM comments WHERE game_id="'+req.query.data+'"',function(error,result){
        game_content.comments = result.map(function(comments){
          return comments.comment;
        });
        res.send(game_content);
      });
    });
  } else if(req.query.type == "comment"){
    var data = JSON.parse(req.query.data);
    connection.query('INSERT INTO comments SET ?',data,function(error,result){
      data.id = result.insertId;
      res.send(data);
    });
} else if(req.query.type == "removeGame"){
    connection.query('DELETE FROM games WHERE id="'+req.query.data+'"',function(error,result){
      res.send(req.query.data);
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
