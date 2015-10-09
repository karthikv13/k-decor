exports.index = function(req, res) {
  res.render('products', {
    title: 'Home'
  });
};