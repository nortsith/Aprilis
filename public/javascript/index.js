(function(index){
  var online_users = jQuery('#users'),
      users_frame  = jQuery('.frame'),
      search_input = jQuery('#search'),
      game_element = jQuery('.game');

  index.init = function(){
    index.updates();
    index.events();
  };

  index.updates = function(){

  };

  index.events = function(){
    search_input.keyup(function(){
      index.search_query();
    });
  };

  index.search_query = function(){
    jQuery('.game').each(function(index){
      var game = jQuery(this);
      game.attr('search-value').indexOf(search_input.val().toLowerCase()) > -1 ? game.removeClass('fade_out_game') : game.addClass('fade_out_game');
    });
  };

  index.init();
})({});
