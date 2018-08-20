'use strict';

const mongoose = require('../mongoose.js');

const Books = new mongoose.Schema({
  author_id: {
   type: mongoose.Schema.ObjectId,
   required: true
  },
  name: {
    type: String,
    trim: true,
    required: true
  },
  publish_date: {
    type: Number,
    required: true
  },
  created: {
    type: Date,
    default: Date.now,
    required: true
  }
}, {
  strict: true
});

Books.static('insert', function({ author_id, name, publish_date, }) {
  const me = this;
  return new Promise((resolve, reject) => {
    me.create({
      author_id,
      name,
      publish_date,
    }, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
});

module.exports = mongoose.model('books', Books);