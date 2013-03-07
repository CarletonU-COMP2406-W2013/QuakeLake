
/*
 * GET game page.
 */

exports.list = function(req, res){
	 if(req.session.username){
	 	  res.render('game.jade', { title: 'Game' , user: req.session.username});
	 }else{
	 	  res.redirect('/');
	 	}
};