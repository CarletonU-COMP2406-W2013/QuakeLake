
/*
 * GET game page
 */

exports.render = function(req, res){
	if(req.session.username){
		res.render('game.jade', { title: 'Game' , user: req.session.username});
	}else{
		res.render('game.jade', { title: 'Game', user: "Anonymous Coward - Sign up to appear in the leaderboard"});
	} 
};
