const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const path = require('path');
const User = require('../models/User');
const File = require('../models/File');
const shortid = require('shortid');
const conn = mongoose.createConnection(process.env.MONGODB_URI);
// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('library');
});

exports.library = (req, res) => {
  if(req.user.files) {
    res.render('library', {
        title: 'Library',
        files: req.user.files
    });
  } else {
    res.render('library');
  }

};

exports.postLibrary = (req, res) => {

    User.findById(req.user.id, (err, user) => {
      // Generate a ID Once.
      const generatedID = shortid.generate();
      req.file.shortid = generatedID;
      // Store it in the variable.

      // array.push(req.file)
      // reqfile.push({ shortid: generatedID });
      // Push the variable into our User
      user.files.push(req.file);
      // Initiate our File
      var newFile = new File();
      // Check if theres a file?
      if(req.file.filename && req.file.shortid) {
        newFile.filename = req.file.filename;
        // Store the same ID inside the newFile object
        newFile.shortid = req.file.shortid;
        user.save( (err) => {
          if(err) return next(err);
        })
        newFile.save( (err) => {
          if(err) return next(err);
          req.flash('success', {msg: `File uploaded ${process.env.SITEURL}/f/${newFile.shortid}`});
          res.redirect('/library')
        })
      }
      // file.filename = req.file.filename;
  });
}
// We're getting the filename on /v/image in img element
// and retrieveing the stream image
exports.viewImage = (req, res) => {
  File.findOne({ shortid: req.params.shortid}, (err, result) => {
      if(err) return console.log(err);
    gfs.files.findOne({ filename: result.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }

      // Check if image
      if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
        // Read output to browser
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
      } else {
        res.status(404).json({
          err: 'Not an image'
        });
      }
    });
  })

}
// Display the image
exports.view = (req, res) => {
    // console.log(req.params.filename);
    if(req.params) {
      File.findOne({shortid: req.params.shortid}, (err, result) => {
        if(result) {
            gfs.files.findOne({filename: result.filename}, (err, file) => {
              if(err) return console.log(err);
                if(!file || file.length == 0) {
                  return res.status(404).json({
                    err: 'No File Exists'
                  });
                }
                if(shortid && file){

                  res.render('library/view',{ shortid: req.params.shortid, file: file})
                }

              });
          }
      });
  }
}
exports.download = (req, res) => {
  /*
    V2: Upon Upload, store a reference model.
    This reference model will hold the
    filename : so we can gfs.findOne
    shortid: : so we can find it.
    And we return the shortid to the user as a success message.
    And on /f/88888 , that shortid is searched and that document
    is retrieved and we use that document's filename reference
    to grab the Filename

  */
  if(req.params) {
  File.findOne({ shortid: req.params.shortid}, (err, result) => {
    if(result) {
      gfs.files.findOne({ filename: result.filename }, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
          return res.status(404).json({
            err: 'No file exists'
          });
        }

        // Check if image
        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
          // Read output to browser
          res.set('Content-Type', file.contentType);
          res.set('Content-Disposition', 'attachment; filename="' + file.filename + '"');
          const readstream = gfs.createReadStream(file.filename);
          readstream.pipe(res);
        } else {
          res.status(404).json({
            err: 'Not an image'
          });
        }
      });
  }
  })
}
}
