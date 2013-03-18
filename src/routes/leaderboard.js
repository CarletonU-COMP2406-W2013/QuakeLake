
/*
 * GET leaderboard page.
 */

exports.leaderboard = function(req, res, items){
		
		
	 res.render('leaderboard.jade', { title: 'Leaderboard' , users: items});
};