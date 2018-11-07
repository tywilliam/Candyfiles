/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  res.render('home', {
    title: 'Home'
  });
};
exports.library = (req, res) => {
  res.render('library', {
    title: 'Library'
  });
};