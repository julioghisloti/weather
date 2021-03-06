$(document).ready(function(){

	$('input[type="input"]').focus();
	
	var raw_template = $('#weather-template').html();	
	var template = Handlebars.compile(raw_template);
	var placeHolder = $('.forecast');

	weather("New York, NY");

	$('#location-form').submit(function(e){
		e.preventDefault();
		$('.loading').fadeIn();	
		$('.forecast').empty();
		var location = $('#location').val();
		weather(location);
	});

	$('.city-error').on('click', function(){
		weather("New York, NY");
		$(this).fadeOut();
	});

	function flickr(lat, long) {
		$.ajax({
			type: 'GET',
			url: 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=9ccb20724160d26c4dfb5f4b89963270&lat='+ lat +'&lon='+ long +'&group_id=1463451@N25&per_page=1&format=json&nojsoncallback=1',
			success: function(data){
				$.each(data.photos.photo, function(i, photo){
					var farmId = photo.farm;
					var serverId = photo.server;
					var id = photo.id;
					var secret = photo.secret;
					var imgUrl = 'https://farm'+ farmId +'.staticflickr.com/'+ serverId +'/'+ id +'_'+ secret +'_b.jpg';

					$('.mc-image').css('background-image', 'url('+ imgUrl +')');
					$('.image').css('background-image', 'url('+ imgUrl +')');
				});
			},
			complete: function(data){
				$('.loading').fadeOut();

				if(data.responseJSON.photos.total == 0){
					$('.mc-image').css('background-image', 'url()');
					$('.image').css('background-image', 'url(https://i0.wp.com/farm4.static.flickr.com/3336/3293815044_ae2a35f376_o.jpg)');
				}
			}
		})
	}

	function weather(location){
		$.ajax({
			type: 'GET',
			url: 'https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + location + '") and u="c" &format=json',
			success: function(data){
				if(data.query.results.channel.item.title != 'City not found'){
					$.each(data.query.results.channel.item.forecast, function(index, show){
						if(index == 0){
							show.day = 'Today';	
						}

						var city = data.query.results.channel.title.split('-');
						$('#location').val('').attr('placeholder', city[1]);
						var html = template(show);
						placeHolder.append(html);
					});

					var lat = data.query.results.channel.item.lat;
					var long = data.query.results.channel.item.long;

					flickr(lat, long);
				}else{

					$('.city-error').fadeIn();

				}
			}
		});	
	}

	

});