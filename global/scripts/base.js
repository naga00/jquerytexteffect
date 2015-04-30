jQuery(function($){
	var menu = $('.textEffect');
	menu.each(function(){
		$(this).textEffect();
		$(this).hover(
			function () {
				console.log($(this));
				$(this).css('cursor','pointer'); 
				$(this).textEffect();
			},
			function () {
			}
		);
	});
});
