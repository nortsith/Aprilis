var express = require('express'),
    path    = require('path'),
    fs      = require('fs'),
    router  = express.Router();

router.post('/games', function (req, res) {
  if(req.query.type == "get"){
    res.sendFile(path.resolve('./database/games.json'));
  } else{
    res.send(req.query.data);

    function add_game(data){
      var data_file = fs.readFileSync('./database/games.json');
      var GAMES = JSON.parse(data_file);
      var id = Object.keys(GAMES).length > 0 ? JSON.parse(GAMES[Object.keys(GAMES).length-1]).id+1 : 1;
      var game = JSON.parse(data);
      game.id = id;
      GAMES[Object.keys(GAMES).length] = JSON.stringify(game);
      var dataJSON = JSON.stringify(GAMES);
      fs.writeFileSync('./database/games.json', dataJSON);
    }

    add_game(req.query.data);
  }
});

module.exports = router;
