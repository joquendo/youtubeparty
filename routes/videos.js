var express = require('express'),
	router 	= express.Router(),
	Video 	= require('../models/video');
 
 
router.get('/',function(req,res){
	Video.find(function (err, messages){
		if (err) return console.error(err);
		res.json(messages);
	});
});

router.post('/',function(req,res){
	var video = new Video(req.body);
	video.save(function (err, v){
		 if (err) return console.error(err);
		 res.json(v);
	})
});
 
router.delete('/:videoId',function(req,res){
	var videoId=req.params.videoId;
	Video.remove({videoId : videoId},function(Err){
		res.json(videoId);
	});
})
 
module.exports = router;