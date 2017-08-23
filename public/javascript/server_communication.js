(function(client){
  var socket = io();
  var online_users  = jQuery('#users'),
      users_frame   = jQuery('.frame'),
      games_wrapper = jQuery('#games_container');

  client.init = function(){
    socket.connect();
    client.events();
    client.visual_updates();
    client.get_games();
  };

  client.get_games = function(){
    jQuery.ajax({
      url: "/games?type=get",
      type: 'POST',
      success: function(games){
        client.create_games(games);
      }
    });
  };

  client.create_games = function(games){
    var html = "";
    for(var i in games){
      var game = JSON.parse(games[i]);

      html += '<div class="game"><div class="centered"><span>'+game.title+'</span></div></div>';
    }
    games_wrapper.append(html);
  };

  client.events = function(){
    socket.on('user_connected',function(user_count){
      client.update_user_count(user_count);
    });
    socket.on('user_disconnected',function(user_count){
      client.update_user_count(user_count);
    });
  };

  client.update_user_count = function(user_count){
    online_users.text(user_count).trigger('change');
  };

  client.visual_updates = function(){
    online_users.on('change',function(){
      users_frame.addClass('glow');
      client.remove_class({
        element: users_frame,
        class  : 'glow',
        delay  : 500
      });
    });
  };

  client.remove_class = function(config){
    setTimeout(function(){
      config.element.removeClass(config.class);
    },config.delay || 500);
  };

  client.init();
})({});
