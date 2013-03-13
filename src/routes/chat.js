
/*
 * GET game page.
 */

exports.list = function(req, res){
	 if(req.session.username){
	 	  res.render('chat.jade', { title: 'Chat' , user: req.session.username});
	 }else{
	 	  res.redirect('/');
	 	}
};
