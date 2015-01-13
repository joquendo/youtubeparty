var express = require('express');
var routes = require('./routes/index');
var videoRoutes = require('./routes/videos');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var flash = require('connect-flash');
var initPassport = require('./passport/init');
var expressSession = require('express-session');
var passport = require('passport');

var path = require('path');
var config = require('./config.js');
var youtube = require('./youtube');
var youTubeclient = new youtube.Client(config.youTube);

var app = express();
mongoose.connect(config.mongoUrl);

initPassport(passport);
app.use(flash());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.set('port', (process.env.PORT || 6500));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower', express.static(path.join(__dirname, 'bower_components')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

var http = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', function(socket) {
	console.log('a user connected');
	socket.on('play', function(videoId){
		console.log('newVideo ' + videoId);
		io.sockets.emit('newVideo', videoId);
	});
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