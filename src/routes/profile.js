/*
 * GET profile page.
 */

exports.showProfile = function(req, res, user){
	 res.render('profile.jade', { title: user.username , username: user});
};

exports.editProfile = function(req, res){
	if(req.session.username){
	 res.render('password.jade', { title: "Change your Password", error: req.query.error});
	}else{
		res.redirect('/?error=Please Log in');
	}
};