var mongoose = require('mongoose');
var videoSchema = mongoose.Schema({
    videoId: String,
    description: String
})
var Video = mongoose.model('Video', videoSchema);
 
module.exports = Video;