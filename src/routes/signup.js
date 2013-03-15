
/*
 * GET sign-up page.
 */

exports.render = function(req, res){
	 	  res.render('signup.jade', { title: 'Sign up', error: req.query.error });
	 
};