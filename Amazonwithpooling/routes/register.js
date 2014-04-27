
/*
 * GET home page.
 */

exports.register = function(req, res){
  res.render('registration', { title: 'Registration' });
};