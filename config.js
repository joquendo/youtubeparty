require('custom-env').env();

module.exports = {
	mongoUrl : `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-zorrn.mongodb.net/test?retryWrites=true&w=majority`,
	youTube : {
		key : process.env.YOUTUBE_API,
		maxResults : 10		
	},
	facebook : {
		clientID: process.env.FACEBOOK_CLIENT_ID,
		clientSecret : process.env.FACEBOOK_CLIENT_SECRET,
		callbackURL : 'https://jamesyoutubeparty.herokuapp.com/auth/facebook/callback'
	}
}