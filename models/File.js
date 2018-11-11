const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: {
        type: String
    },
    shortid: {
      type: String
    }
}, { timestamps: true });

const File = mongoose.model('File', fileSchema);

module.exports = File;
