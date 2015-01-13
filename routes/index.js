var express = require('express');
var router = express.Router();
var passport = require('passport');

// As with any middleware it is quintessential to call next()
// if the user is authenticated
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
}

/* GET home page. */
router.get('/', isAuthenticated, function(req, res) {
	var user = req.user;
	var pageData = {
		title: 'James\'s YouTube Party | jamesoquendo.com/projects',
		DisplayName: user.displayName(),
		ProfileImage: user.profileImage()
	};

	io.sockets.emit("join",pageData);
	res.render('index',pageData);
});

router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
router.get('/auth/facebook/callback', passport.authenticate('facebook', {
	successRedirect: '/',
	failureRedirect: '/login'
}));

router.get('/login', function(req, res) {
	res.render('login', { message: req.flash('message') });
});

router.get('/signout', function(req, res) {
	req.logout();
	res.redirect('/');
});

var io;
function out(i) {
	io=i;
	return router;
}

module.exports = out;