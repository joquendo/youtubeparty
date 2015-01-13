var https = require('https'),
        baseUrl = 'https://content.googleapis.com/youtube/v3'; 
 
var YouTubeClient = (function () {
    function YouTubeClient(config) {
        this.key = config.key;
        this.maxResults=config.maxResults;
    }
 
    YouTubeClient.prototype.search = function (term,callBack,error) {
        var client = this;
        var req = https.get(baseUrl + '/search?part=id%2Csnippet&q=' + term + '&maxResults=' + client.maxResults + '&key=' + client.key, function(res) {
            var str='';
            res.on('data', function (chunk) {
                str += chunk;
            });
 
            res.on('end', function () {
                callBack(JSON.parse(str));
            });         
        });
 
        req.on('error', function(e) {
            if(error)error(e);
        });
    };
 
    return YouTubeClient;
})();
 
exports.Client = YouTubeClient;