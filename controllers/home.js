/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  if(!req.user) {
    res.render('flat', {
      title: 'DevLoad welcome'
    })
  } else {
    res.render('home', {
      title: 'Home'
    });

  }
};
exports.library = (req, res) => {
  res.render('library', {
    title: 'Library'
  });
};
exports.flat = (req, res) => {
  res.render('flat')
}