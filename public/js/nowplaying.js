function NowPlaying(){
	this.data=["EWEl8-PHhMI","9e0yCq1AEeY"];
	this.current=0;
}

NowPlaying.prototype.next = function() {
	return this.data[this.current++];
};

NowPlaying.prototype.add = function(videoId) {
	return this.data.push(videoId);
};