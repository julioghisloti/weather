function getWeather(e){$.ajax({type:"GET",url:'https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="'+e+'")&format=json'}).done(function(e){$.each(e.query.results.channel.item.forecast,function(e,o){console.log(o),$(".forecast").append('<div class="day">dia: '+o.day+" / temp: "+o.high+"</div>")});var o=e.query.results.channel.item.lat,a=e.query.results.channel.item["long"];$.ajax({type:"GET",url:"https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=9ccb20724160d26c4dfb5f4b89963270&lat="+o+"&lon="+a+"&group_id=1463451@N25&per_page=1&format=json&nojsoncallback=1"}).done(function(e){$.each(e.photos.photo,function(e,o){var a=o.farm,t=o.server,c=o.id,n=o.secret,r="https://farm"+a+".staticflickr.com/"+t+"/"+c+"_"+n+"_b.jpg";$(".mc-image").css("background-image","url("+r+")"),$(".image").css("background-image","url("+r+")"),$("body").fadeIn()})}).fail(function(e){console.log(e)})}).fail(function(e){console.log(e)})}$(window).load(function(){getWeather("New York, NY"),$("#change").on("click",function(){var e=$("#location").val();getWeather(e),$("body").fadeOut()})});