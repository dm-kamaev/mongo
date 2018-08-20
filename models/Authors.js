'use strict';

const mongoose = require('../mongoose.js');

const Authors = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    trim:true,
    required: true
  },
  birth_date: {
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

Authors.static('insert', function({ name, birth_date, }) {
  const me = this;
  return new Promise((resolve, reject) => {
    me.create({
      name,
      birth_date,
    }, function(err, author) {
      if (err) {
        reject(err);
      } else {
        resolve(author);
      }
    });
  });
});

/**
 *
 * @param  {Object{ $lt: 18000000 }} author_birth_date:
 * @param  {Number} books_publish_date:
 * @return {Object[]}
 [{
   _id: ObjectID ,
   name: 'А. С. Пушкин',
   birth_date: 17990606,
   created: 2018 - 08 - 20 T12: 51: 27.909 Z,
   __v: 0,
   books: {
     _id: ObjectID,
     author_id: ObjectID {
       _bsontype: 'ObjectID',
       id: [Object]
     },
     name: 'Станционный смотритель',
     publish_date: 1831,
     created: 2018 - 08 - 20 T12: 51: 27.960 Z,
     __v: 0
   }
 }]
 */
Authors.static('find_authors_with_books', function(author_birth_date, books_publish_date) {
  const me = this;
  return new Promise((resolve, reject) => {
    // https://habr.com/post/192870/
    me.aggregate([{
      $match: {
        birth_date: author_birth_date || {
          $lt: 18000000
        }
      }
    }, {
      $lookup: {
        from: 'books',
        localField: '_id',
        foreignField: 'author_id',
        as: 'books',
      },
    },
    // $unwind the array to denormalize
    {
      "$unwind": "$books"
    },
    {
      $match:{
        "books.publish_date": books_publish_date || 1831
      }
    }], function(err, author_with_books) {
      if (err) {
        reject(err);
      } else {
        resolve(author_with_books);
      }
    });
  });
});

module.exports = mongoose.model('author', Authors);

