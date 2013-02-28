var gtty = {
	_config: {
		parseId: '7Q1tYT4F1vItcXOceW3CY9wLi0zKkUcMkOJJs0yj',
		parseSecret: 'pe5A8m1Pebn0xfLi1oeBhvdkTiHBHYd0s21QdlkK',
		facebookId: '446923285377787',
		facebookNamespace: 'mozilla-dev',
		facebookPermissions: 'email'
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
			};
		}
	},
	user: {
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
		}
	}
}

gtty.init.parse(function(){
	gtty.init.facebook();
});