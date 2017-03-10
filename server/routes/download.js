var router = require('express').Router();
var path = require('path');

router.get('/:file_name', function(req, res) {
	res.download(path.join(__dirname, '../../client/public', req.params.file_name),
	 req.params.file_name,
	 function(err) {
	 	if(err) {
	 		console.log(err);
	 		return res.redirect('/404');
	 	}
	});
});

module.exports = router;