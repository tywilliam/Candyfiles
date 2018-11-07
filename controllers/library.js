const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const path = require('path');
const User = require('../models/User');
  
const conn = mongoose.createConnection(process.env.MONGODB_URI);
// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('library');
});

exports.library = (req, res) => {
  if(req.user) {

    res.render('library', {
        title: 'Library',
        files: req.user.files
    });
  } else {
    res.redirect('/')
  }

};

exports.postLibrary = (req, res) => {
    User.findById(req.user.id, (err, user) => {
      user.files.push(req.file);
      console.log(req.file)
      user.save( (err) => {
        if(err) return next(err);
        req.flash('success', { msg: 'File uploaded'});
        res.redirect('/library');
      })
  });
}
exports.download = (req, res) => {
  /**
   * @params /:id
   * I have to make it so
   * Search for the file in each user document.files for :id
   * Grab the reference number
   * gfs.findOne() and send response back to server
*/

  User.find({}, 'files', (err, files) => {
    files.forEach(function(value, index, array) {
        var found = value.files.find(function(el) {
          return el.shortid === req.params.id;
        });
        console.log(found);
      }); 
            gfs.files.findOne({id: found.id}, (err, file) => {
              if(err) return console.log(err);
                if(!file || file.length == 0) {
                  return res.status(404).json({
                    err: 'No File Exists'
                  });
                }
                  res.set('Content-Type', file.contentType);
                  res.set('Content-Disposition', 'attachment; filename="' + file.filename + '"');
                    const readstream = gfs.createReadStream(file.filename);
                    readstream.pipe(res);

            })
  })
  

}