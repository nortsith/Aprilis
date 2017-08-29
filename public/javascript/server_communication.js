(function(client){
  var socket = io();
  var online_users  = jQuery('#users'),
      users_frame   = jQuery('.frame'),
      games_wrapper = jQuery('#games_container'),
      add_button    = jQuery('#add_button'),
      add_game     = jQuery('.add_game'),
      blur         = jQuery('.blur');

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

  client.add_game = function(){
    var inputs = [
      title = {
        element:  jQuery('#data_title'),
        value  :  jQuery('#data_title').val()
      },
      dungeon_master = {
        element:  jQuery('#data_dungeon_master'),
        value  :  jQuery('#data_dungeon_master').val()
      },
      player_limit = {
        element:  jQuery('#data_player_limit'),
        value  :  jQuery('#data_player_limit').val()
      },
      schedule ={
        element:  jQuery('#data_schedule'),
        value  :  jQuery('#data_schedule').val()
      },
      player_level = {
        element:  jQuery('#data_player_level'),
        value  :  jQuery('#data_player_level').val()
      },
      system = {
        element:  jQuery('#data_system'),
        value  :  jQuery('#data_system').val()
      },
      description = {
        element:  jQuery('#data_description'),
        value  :  jQuery('#data_description').val()
      },
    ];

    if(inputs[0].value && inputs[1].value && inputs[2].value && inputs[3].value && inputs[4].value && inputs[5].value && inputs[6].value){
      inputs.forEach(function(input,index){
        input.element.removeClass("warning");
      });

      var data = {
        title          :inputs[0].value,
        dungeon_master :inputs[1].value,
        player_limit   :inputs[2].value,
        schedule       :inputs[3].value,
        player_level   :inputs[4].value,
        system         :inputs[5].value,
        description    :inputs[6].value,
        player_list    : []
      };

      add_game.fadeOut();

      jQuery.ajax({
        url: "/games?data="+JSON.stringify(data),
        type: 'POST',
        success: function(){
          setTimeout(function(){
            blur.fadeOut();
          },500);
          socket.emit('new_game_added',data);
        }
      });

    } else{
      inputs.forEach(function(input,index){
        input.value.length <= 0 ? input.element.addClass("warning") : input.element.removeClass("warning");
      });
    }
  };

  client.get_data = function(){
    return {
      title:jQuery('#data_title'),
      dungeon_master:jQuery('#data_dungeon_master'),
      player_limit:jQuery('#data_player_limit'),
      schedule:jQuery('#data_schedule'),
      player_level:jQuery('#data_player_level'),
      system:jQuery('#data_system'),
      description:jQuery('#data_description'),
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
      jQuery('.game').remove();
      client.get_games();
    });

    jQuery(document).on('click','.game',function(){
        client.update_game_content(this);
    });

    add_button.on('click',function(){
      client.add_game();
    });
    // socket.on('user_connected',function(user_count){
    //   client.update_user_count(user_count);
    // });
    // socket.on('user_disconnected',function(user_count){
    //   client.update_user_count(user_count);
    // });
  };

  client.update_game_content = function(element){
    var title          = jQuery('#game_title'),
        dungeon_master = jQuery('#dungeon_master'),
        player_limit   = jQuery('#player_limit'),
        schedule       = jQuery('#schedule'),
        player_level   = jQuery('#player_level'),
        system         = jQuery('#system'),
        description    = jQuery('#description'),
        game_id = jQuery(element).attr('data-id');

    jQuery.ajax({
      url: "/games?type=get",
      type: 'POST',
      success: function(games){
        for(var id in games){
          if(game_id == JSON.parse(games[id]).id){
            var game_data = JSON.parse(games[id]);
            title.text(game_data.title);
            dungeon_master.text(game_data.dungeon_master);
            player_limit.text(game_data.player_limit);
            schedule.text(game_data.schedule);
            player_level.text(game_data.player_level);
            system.text(game_data.system);
            description.text(game_data.description);
          }
        }
      }
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

  client.add_game

  client.init();
})({});
