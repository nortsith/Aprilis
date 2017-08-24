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

  client.add_game = function(data){
    jQuery.ajax({
      url: "/games?data="+JSON.stringify(data),
      type: 'POST',
    });
    socket.emit('new_game_added',data);
  };

  client.get_data = function(){
    return {
      title:jQuery('#data_title'),
      dungeon_master:jQuery('#data_dungeon_master'),
      player_limit:jQuery('#data_player_limit'),
      schedule:jQuery('#data_schedule'),
      player_level:jQuery('#data_player_level'),
      description:jQuery('#data_description'),
      system:jQuery('#data_system'),
      player_list: []
    }
  }

  client.create_games = function(games){
    var html = "";
    for(var id in games){
      var game = JSON.parse(games[id]);
      html += client.generate_game_html(game);
    }
    games_wrapper.append(html);
  };

  client.generate_game_html = function(game){
    return '<div class="game" search-value="'+game.title.toLowerCase()+'" data-id="'+game.id+'"><div class="centered"><span>'+game.title+'</span></div></div>'
  };

  client.events = function(){
    socket.on('add_new_game',function(data){
      var game = client.generate_game_html(data);
      games_wrapper.append(game);
    });
    // socket.on('user_connected',function(user_count){
    //   client.update_user_count(user_count);
    // });
    // socket.on('user_disconnected',function(user_count){
    //   client.update_user_count(user_count);
    // });
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
