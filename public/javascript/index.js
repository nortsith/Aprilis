(function(index){
  var online_users = jQuery('#users'),
      users_frame  = jQuery('.frame'),
      search_input = jQuery('#search'),
      game_element = jQuery('.game'),
      aprilis_logo = jQuery('.logo'),
      content      = jQuery('.content'),
      game_content = jQuery('.game_content'),
      add_button   = jQuery('.add_button'),
      add_game     = jQuery('.add_game'),
      blur         = jQuery('.blur');

  index.init = function(){
    index.updates();
    index.events();
  };

  index.updates = function(){

  };

  index.events = function(){
    search_input.keyup(function(){
      game_content.removeClass('active');
      index.search_query();
    });

    content.on('scroll',function(){
      game_content.css('top',content.scrollTop()+'px');
    });

    jQuery(document).on('click','.game',function(){
        game_content.addClass('active');
        jQuery('.content').addClass('scroll_disable');
    });

    game_content.on('click',function(){
      index.enable_scroll();
    });

    aprilis_logo.on('click',function(){
      index.enable_scroll();
    });

    add_button.on('click',function(){
      blur.fadeIn();
      setTimeout(function(){
        add_game.fadeIn();
      },500);
    });

    blur.on('click',function(){
      add_game.fadeOut();
      setTimeout(function(){
        blur.fadeOut();
      },500);
    });
  };

  index.enable_scroll = function(){
    game_content.removeClass('active');
    setTimeout(function(){
      content.removeClass('scroll_disable');
    },1000);
  }

  index.search_query = function(){
    jQuery('.game').each(function(index){
      var game = jQuery(this);
      game.attr('search-value').indexOf(search_input.val().toLowerCase()) > -1 ? game.removeClass('fade_out_game') : game.addClass('fade_out_game');
    });
  };

  index.init();
})({});
