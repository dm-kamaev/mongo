'use strict';

'use strict';

const Authors = require('./models/Authors.js');
const Books = require('./models/Books.js');
const promise_api = require('./promise_api.js');

void async function () {
  // await fill_data();
  const authors_with_books = await Authors.find_authors_with_books(null, 1841);
  console.dir(authors_with_books, { depth: 3, colors: true});
  console.log('SUCCESS');
  process.exit(0);
}();


async function fill_data() {
  const data = [{
    name: 'А. С. Пушкин',
    birth_date: 17990606,
    books: [{
      name: 'Капитанская дочка',
      publish_date: 1836,
    }, {
      name: 'Дубровский',
      publish_date: 1841
    }, {
      name: 'Станционный смотритель',
      publish_date: 1831
    }],
  }, {
    name: 'Л. Н. Толстой ',
    birth_date: 18280909,
    books: [{
      name: 'Война и мир',
      publish_date: 1867
    }, {
      name: 'Смерть Ивана Ильича',
      publish_date: 1886,
    }]
  }, {
    name: 'М. Горький',
    birth_date: 18680328,
    books: [{
      name: 'Мать',
      publish_date: 1906
    }, {
      name: 'Мои университеты',
      publish_date: 1923
    }]
  }, {
    name: 'А. П. Чехов ',
    birth_date: 18600129,
    books: [{
      name: 'Дом с мезонином',
      publish_date: 1896
    }, {
      name: 'Беззащитное существо',
      publish_date: 1887
    }],
  }, {
    name: 'Н. В. Гоголь',
    birth_date: 18520304,
    books: [{
      name: 'Коляска',
      publish_date: 1836
    }, {
      name: 'Мёртвые души',
      publish_date: 1842
    }],
  }, {
    name: 'И. С. Тургенев',
    birth_date: 18181109,
    books: [{
      name: 'Дневник лишнего человека',
      publish_date: 1850
    }, {
      name: 'Отцы и дети',
      publish_date: 1862
    }],
  }, {
    name: 'М. Ю. Лермонтов',
    birth_date: 18141015,
    books: [{
      name: 'Мцыри',
      publish_date: 1840
    }, {
      name: 'Княгиня Лиговская',
      publish_date: 1882
    }],
  }, {
    name: 'Ф. М. Достоевский  ',
    birth_date: 18211111,
    books: [{
      name: 'Неточка Незванова',
      publish_date: 1849
    }, {
      name: 'Идиот',
      publish_date: 1869
    }],
  }];
  await promise_api.queue(data, async function (author) {
    const books = author.books || [];
    author = await Authors.insert(author);
    const author_id = author._id;
    await promise_api.queue(books, async function (book) {
      return await Books.insert({
        author_id,
        name: book.name,
        publish_date: book.publish_date
      });
    });
  });
}
