var gtty = {
	_config: {
		parseId: '7Q1tYT4F1vItcXOceW3CY9wLi0zKkUcMkOJJs0yj',
		parseSecret: 'pe5A8m1Pebn0xfLi1oeBhvdkTiHBHYd0s21QdlkK',
		facebookId: '446923285377787',
		facebookNamespace: 'mozilla-dev',
		facebookPermissions: 'email',
		soundcloudId: '2e5fbc52194941846c664a23bf45cc16'
	},
	init: {
		parse: function parse(callback){
			Parse.initialize(gtty._config.parseId, gtty._config.parseSecret);
			callback();
		},
		facebook: function facebook(){
			window.fbAsyncInit = function() {
				Parse.FacebookUtils.init({
					appId      : gtty._config.facebookId, // App ID from the App Dashboard
					status     : true, // check the login status upon init?
					cookie     : true, // set sessions cookies to allow your server to access the session?
					xfbml      : true  // parse XFBML tags on this page?
				});
				FB.getLoginStatus(function(response) {
					console.log(response);
					if (response.status === 'connected') {
						gtty.user.logins({
							facebook: false,
							youtube: true,
							soundcloud: true
						});
					} else {
						gtty.user.logins({
							facebook: true,
							youtube: false,
							soundcloud: false
						});
					}
				});
			}
		},
		soundcloud: function soundcloud(){
			SC.initialize({
				client_id: gtty._config.soundcloudId
			});
		}
	},
	get: function(object, callback){

	},
	user: {
		logins: function(object){
			if(object.facebook === true){
				$('.gtty-facebook').show();
			} else {
				$('.gtty-facebook').hide();
			}
			if(object.youtube === true){
				$('.gtty-youtube').show();
			} else {
				$('.gtty-youtube').hide();
			}
			if(object.soundcloud === true){
				$('.gtty-soundcloud').show();
			} else {
				$('.gtty-soundcloud').hide();
			}
		},
		facebook: {
			connect: function connect(){
				var _this = this;
				Parse.FacebookUtils.logIn(gtty._config.facebookPermissions, {
					success: function(user) {
						if (!user.existed()) {
							console.log("User signed up and logged in through Facebook!");
							_this.getUserData();
						} else {
							console.log("User logged in through Facebook!");
						}
						gtty.user.logins({
							facebook: false,
							youtube: true,
							soundcloud: true
						});
					},
					error: function(user, error) {
						console.log("User cancelled the Facebook login or did not fully authorize.");
					}
				});
			},
			getUserData: function getUserData(){
				var _this = this;
				FB.api('/me', function(response) {
					_this.saveUserData(response);
				});
			},
			saveUserData: function saveUserData(userData){
				var user = Parse.User.current();
				user.set("name", userData.name);
				user.set("firstname", userData.first_name);
				user.set("lastname", userData.last_name);
				user.set("email", userData.email);
				user.setACL(new Parse.ACL(Parse.User.current()));
				user.save(null, {
					success: function(user) {
						console.log("Userdata saved to Parse");
					},
					error: function(user, error) {
						console.log("Userdata failed to save");
					}
				});
			}
		},
		youtube: {
			getUserData: function getUserData(username){
				var _this = this;
				var url = "http://gdata.youtube.com/feeds/api/users/" + username + "?v=2&alt=json";

				$.ajax({
					url: url,
					success: _this.processUserData,
					dataType: 'json'
				});
			},
			processUserData: function processUserData(data, textStatus, jqXHR){
				console.log(data);
			},
			getUserVideos: function getUserVideos(username){
				var _this = this;
				var url = "http://gdata.youtube.com/feeds/api/users/" + username + "/uploads?v=2&alt=json";

				$.ajax({
					url: url,
					success: _this.processUserVideos,
					dataType: 'json'
				});
			},
			processUserVideos: function processUserVideos(data, textStatus, jqXHR){
				console.log(data);
			},
			saveUserData: function(userData){
				var user = Parse.User.current();
				user.set("youtube", userData.username);
				user.save(null, {
					success: function(user) {
						console.log("Userdata saved to Parse");
					},
					error: function(user, error) {
						console.log("Userdata failed to save");
					}
				});
			}
		},
		soundcloud: {
			streamSong: function streamSong(trackId){
				SC.stream("/tracks/" + trackId, {
					autoPlay: true
				});
			},
			findUser: function findUser(name){
				SC.get('/users', { q: name, username: name}, function(users) {
					console.log(users);
				});
			},
			getUserData: function getUserData(userId){
				SC.get('/users/' + userId, function(user) {
					console.log(user);
				});
			},
			saveUserData: function(userData){
				var user = Parse.User.current();
				user.set("soundcloud", userData.username);
				user.save(null, {
					success: function(user) {
						console.log("Userdata saved to Parse");
					},
					error: function(user, error) {
						console.log("Userdata failed to save");
					}
				});
			}
		}
	}
}

gtty.init.parse(function(){
	gtty.init.facebook();
	gtty.init.soundcloud();
});

gtty.get({
	facebook: 'me', //ALWAYS USE ME
	youtube: 'user', //DEFINE USERNAME
	soundcloud: 'user' //DEFINE USERNAME
}, function(json){

});