
/*
 * GET home page.
 */

exports.trytologin = function(req, res){
  res.render('login', { title: 'LogIn' });
};