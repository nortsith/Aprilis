var express = require('express'),
    path    = require('path'),
    fs      = require('fs'),
    router  = express.Router();

router.post('/games', function (req, res) {
  if(req.query.type == "get"){
    res.sendFile(path.resolve('./database/games.json'));
  } else{
    res.send(req.query.data);

    function add_game(game){
      var data_file = fs.readFileSync('./database/games.json');
      var GAMES = JSON.parse(data_file);
      GAMES[Object.keys(GAMES).length] = game;
      var dataJSON = JSON.stringify(GAMES);
      fs.writeFileSync('./database/games.json', dataJSON);
    }

    add_game(req.query.data);
  }
});

module.exports = router;

// var data = {
//   title:"Adı Geçmeyenler Kulübü",
//   dungeon_master:"Onur Şahin Şentürk",
//   player_limit:"4",
//   schedule:"Pazar 12-14",
//   player_level:"İleri seviye",
//   description:"Lorem ipsun dolor sit amet",
//   system:"Custom",
//   player_list: []
// }
