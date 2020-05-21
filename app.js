var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var youtube = require('./youtube');
var path = require('path');
var routes = require('./routes/index');
var videoRoutes = require('./routes/videos');
var config = require('./config.js');
var passport = require('passport');
var initPassport = require('./passport/init');
var expressSession = require('express-session');


var app = express();
mongoose.connect(config.mongoUrl);

initPassport(passport);

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
var flash = require('connect-flash');
app.use(flash());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
var youTubeclient = new youtube.Client(config.youTube);

app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower', express.static(path.join(__dirname, 'bower_components')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket) {
	console.log('a user connected');
	socket.on('play', function(videoId){
		console.log('newVideo ' + videoId);
		io.sockets.emit('newVideo', videoId);
	})
	socket.on('chat message', function(msg, img){
		io.emit('chat message', msg, img);
	});
});

app.use('/', routes(io));
app.use('/video', videoRoutes);

app.get('/search', function(req, res) {
	var term = req.query['q'];
	youTubeclient.search(term, function(data) {
		res.json(data);
		res.end();
	});
});

var server = http.listen(app.get('port'), function() {
	console.log("Express server listening on port " + server.address().port);
});