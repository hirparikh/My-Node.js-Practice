
/*
 * GET home page.
 */

exports.insertsuccess = function(req, res){
  res.render('successInsert', { title: 'Registration Successful' });
};