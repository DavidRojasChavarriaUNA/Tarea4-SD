// main.js
const fs = require('fs');
const express = require('express');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const cors = require('cors');

const {
  clientPromise,
  dbName,
  collection
} = require('./mongoDB');

const app = express();
const port = process.env.PORT || 1337;

const myusername1 = 'userUNA1';
const myusername2 = 'userUNA2';
const mypassword = '12345';

/*let books = [];
let authors = [];
let publishers = [];

//username and password

const loadBooks = () => {
  fs.readFile(__dirname + '/' + 'books.json', 'utf8', (err, data) => {
    books = JSON.parse(data)
  });
}

const loadAuthors = () => {
  fs.readFile(__dirname + '/' + 'authors.json', 'utf8', (err, data) => {
    authors = JSON.parse(data)
  });
}

const loadPublishers = () => {
  fs.readFile(__dirname + '/' + 'publishers.json', 'utf8', (err, data) => {
    publishers = JSON.parse(data)
  });
}

loadBooks()
loadAuthors()
loadPublishers()

const saveBooks = () => {
  let data = JSON.stringify(books)
  fs.writeFileSync(__dirname + '/' + 'books.json', data)
}

const saveAuthors = () => {
  let data = JSON.stringify(authors)
  fs.writeFileSync(__dirname + '/' + 'authors.json', data)
}

const savePublishers = () => {
  let data = JSON.stringify(publishers)
  fs.writeFileSync(__dirname + '/' + 'publishers.json', data)
}
*/

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

app.use(sessions({
  secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
  saveUninitialized: true,
  cookie: {
    httpOnly: false,
    secure: false,
    maxAge: oneDay
  },
  resave: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser middleware
app.use(cookieParser());

/*
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Content-Type', 'application/json');
  next();
});*/

var corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));


const isAuthenticated = (req, res) => {
  const session = req.session;
  if (!session || !session.userid) {
    res.status(401).send('Unautorized');
    return false;
  }
  return true;
}

/*app.get('/book', (req, res) => {
  if (!isAuthenticated(req, res)) return;
  res.json(books);
})*/

app.get('/book', async (req, res) => {
  if (!isAuthenticated(req, res)) return;
  const client = await clientPromise;
  const books = await client.db(dbName).collection(collection.Books).find({}).toArray();
  if (books.length > 0)
    res.json(books);
  else
    res.status(404).send('Books not found');
})

/*app.get('/book/:id', (req, res) => {
  if (!isAuthenticated(req, res)) return;
  let book = books.find(i => i._id == req.params.id);
  if (book == undefined)
    res.status(404).send('Book not found');
  else
    res.json(book);
})*/

app.get('/book/:id', async (req, res) => {
  if (!isAuthenticated(req, res)) return;
  const client = await clientPromise;
  const id = parseInt(req.params.id);
  const book = await client.db(dbName).collection(collection.Books).findOne({
    _id: id
  });
  if (book == undefined)
    res.status(404).send('Book not found ');
  else
    res.json(book);
})

/*app.post('/book/:id', (req, res) => {
  if (!isAuthenticated(req, res)) return;
  let index = books.findIndex(i => i._id == req.params.id);
  if (index != -1)
    res.status(404).send('Book already exits');
  else {
    books.push(req.body);
    saveBooks();
  }
})*/

app.post('/book/:id', async (req, res) => {
  if (!isAuthenticated(req, res)) return;
  const id = parseInt(req.params.id);
  const client = await clientPromise;
  const book = await client.db(dbName).collection(collection.Books).findOne({
      _id: id
    });
  if (book)
    res.status(422).send('Book already exits');
  else {
    await client.db(dbName).collection(collection.Books).insertOne(req.body);
    res.status(200).send('OK');
  }
})

/*app.put('/book', (req, res) => {
  if (!isAuthenticated(req, res)) return;
  let index = books.findIndex(i => i._id == req.params.id);
  if (index == -1)
    res.status(404).send('Book not found');
  else {
    books[index] = req.body;
    saveBooks();
  }
})*/

app.put('/book/:id', async (req, res) => {
  if (!isAuthenticated(req, res)) return;
  const id = parseInt(req.params.id);
  const client = await clientPromise;
  const result = await client.db(dbName).collection(collection.Books).updateOne({
    _id: id
  }, {
    $set: req.body
  });
  if (result.modifiedCount || result.matchedCount)
    res.status(200).send('OK');
  else
    res.status(404).send('Book not found');
})

/*app.delete('/book/:id', (req, res) => {
  if (!isAuthenticated(req, res)) return;
  let index = books.findIndex(i => i._id == req.params.id);
  if (index == -1)
    return resolve();
  else {
    books = books.filter(i => i._id != req.params.id);
    saveBooks();
  }
})*/

app.delete('/book/:id', async(req, res) => {
  if (!isAuthenticated(req, res)) return;
  const id = parseInt(req.params.id);
  const client = await clientPromise;
  const result = await client.db(dbName).collection(collection.Books).deleteOne({
    _id: id
  });
  if (result.deletedCount === 1)
    res.status(200).send('Book deleted');
  else 
    res.status(404).send('Book not found');
})

/*app.get('/author', (req, res) => {
  if (!isAuthenticated(req, res)) return;
  res.json(authors);
})*/

app.get('/author', async(req, res) => {
  if (!isAuthenticated(req, res)) return;
  const client = await clientPromise;    
  const authors = await client.db(dbName).collection(collection.Authors).find({}).toArray();
  if (authors.length > 0)
    res.json(authors);
  else
    res.status(404).send('Authors not found');
})

/*app.get('/author/:id', (req, res) => {
  if (!isAuthenticated(req, res)) return;
  let author = authors.find(i => i._id == req.params.id);
  if (author == undefined)
    res.status(404).send('Author not found');
  else
    res.json(author);
})*/

app.get('/author/:id', async(req, res) => {
  if (!isAuthenticated(req, res)) return;
  const client = await clientPromise;
  const id = parseInt(req.params.id);
  const author = await client.db(dbName).collection(collection.Authors).findOne({
      _id: id
    });
  if (author == undefined)
    res.status(404).send('Author not found');
  else
    res.json(author);
})

/*app.post('/author/:id', (req, res) => {
  if (!isAuthenticated(req, res)) return;
  let index = authors.findIndex(i => i._id == req.params.id);
  if (index != -1)
    res.status(404).send('Author already exits');
  else {
    authors.push(req.body);
    saveAuthors();
  }
})*/

app.post('/author/:id', async(req, res) => {
  if (!isAuthenticated(req, res)) return;
  const id = parseInt(req.params.id);
  const client = await clientPromise;
  const author = await client.db(dbName).collection(collection.Authors).findOne({
      _id: id
    });
  if (author)
    res.status(404).send('Author already exits');
  else {
    await client.db(dbName).collection(collection.Authors).insertOne(req.body);
    res.status(200).send('OK');
  }
})

/*app.put('/author', (req, res) => {
  if (!isAuthenticated(req, res)) return;
  let index = authors.findIndex(i => i._id == req.params.id);
  if (index == -1)
    res.status(404).send('Author not found');
  else {
    authors[index] = req.body;
    saveAuthors();
  }
})*/

app.put('/author/:id', async(req, res) => {
  if (!isAuthenticated(req, res)) return;
  const id = parseInt(req.params.id);
  const client = await clientPromise;
  const result = await client.db(dbName).collection(collection.Authors).updateOne({
    _id: id
  }, {
    $set: req.body
  });
  if (result.modifiedCount || result.matchedCount)
    res.status(200).send('OK');
  else
    res.status(404).send('Author not found');
})

/*app.delete('/author/:id', (req, res) => {
  if (!isAuthenticated(req, res)) return;
  let index = authors.findIndex(i => i._id == req.params.id);
  if (index == -1)
    return resolve();
  else {
    authors = authors.filter(i => i._id != req.params.id);
    saveAuthors();
  }
})*/

app.delete('/author/:id', async(req, res) => {
  if (!isAuthenticated(req, res)) return;
  const id = parseInt(req.params.id);
  const client = await clientPromise;
  const result = await client.db(dbName).collection(collection.Authors).deleteOne({
    _id: id
  });
  if (result.deletedCount === 1)
    res.status(200).send('Author deleted');
  else 
    res.status(404).send('Author not found');
})

/*app.get('/publisher', (req, res) => {
  if (!isAuthenticated(req, res)) return;
  res.json(publishers);
})*/

app.get('/publisher', async(req, res) => {
  if (!isAuthenticated(req, res)) return;
  const client = await clientPromise;    
  const publishers = await client.db(dbName).collection(collection.Publishers).find({}).toArray();
  if (publishers.length > 0)
    res.json(publishers);
  else
    res.status(404).send('Publishers not found');
})

/*app.get('/publisher/:id', (req, res) => {
  if (!isAuthenticated(req, res)) return;
  let publisher = publishers.find(i => i._id == req.params.id);
  if (publisher == undefined)
    res.status(404).send('Publisher not found');
  else
    res.json(publisher);
})*/

app.get('/publisher/:id', async(req, res) => {
  if (!isAuthenticated(req, res)) return;
  const client = await clientPromise;
  const id = parseInt(req.params.id);
  const publisher = await client.db(dbName).collection(collection.Publishers).findOne({
      _id: id
    });
  if (publisher == undefined)
  res.status(404).send('Publisher not found');
  else
    res.json(publisher);
})

/*app.post('/publisher/:id', (req, res) => {
  if (!isAuthenticated(req, res)) return;
  let index = publishers.findIndex(i => i._id == req.params.id);
  if (index != -1)
    res.status(404).send('Publisher already exits');
  else {
    publishers.push(req.body);
    savePublishers();
  }
})*/

app.post('/publisher/:id', async(req, res) => {
  if (!isAuthenticated(req, res)) return;
  const id = parseInt(req.params.id);
  const client = await clientPromise;
  const publisher = await client.db(dbName).collection(collection.Publishers).findOne({
      _id: id
    });
  if (publisher)
    res.status(404).send('Publisher already exits');
  else {
    await client.db(dbName).collection(collection.Publishers).insertOne(req.body);
    res.status(200).send('OK');
  }
})

/*app.put('/publisher', (req, res) => {
  if (!isAuthenticated(req, res)) return;
  let index = publishers.findIndex(i => i._id == req.params.id);
  if (index == -1)
    res.status(404).send('Publisher not found');
  else {
    publishers[index] = req.body;
    savePublishers();
  }
})*/

app.put('/publisher/:id', async(req, res) => {
  if (!isAuthenticated(req, res)) return;
  const id = parseInt(req.params.id);
  const client = await clientPromise;
  const result = await client.db(dbName).collection(collection.Publishers).updateOne({
    _id: id
  }, {
    $set: req.body
  });
  if (result.modifiedCount || result.matchedCount)
    res.status(200).send('OK');
  else
    res.status(404).send('Publisher not found');
})

/*app.delete('/publisher/:id', (req, res) => {
  if (!isAuthenticated(req, res)) return;
  let index = publishers.findIndex(i => i._id == req.params.id);
  if (index == -1)
    res.status(404).send('Publisher not found');
  else {
    publishers = publishers.filter(i => i._id != req.params.id);
    savePublishers();
    res.status(200).send('Publisher deleted');
  }
})*/

app.delete('/publisher/:id', async(req, res) => {
  if (!isAuthenticated(req, res)) return;
  const id = parseInt(req.params.id);
  const client = await clientPromise;
  const result = await client.db(dbName).collection(collection.Publishers).deleteOne({
    _id: id
  });
  if (result.deletedCount === 1)
    res.status(200).send('Publisher deleted');
  else {
    res.status(404).send('Publisher not found');
  }
})

//login
app.post('/user/login', (req, res) => {
  if ((req.body.username == myusername1 || req.body.username == myusername2) && req.body.password == mypassword) {
    const session = req.session;
    session.userid = req.body.username;
    res.json({userid: session.userid});
  } else {
    res.status(401).send('Invalid username or password');
  }
})

//get authenticated user
app.get('/user/getUser', (req, res) => {
  if (!isAuthenticated(req, res)) return;
  const session = req.session;
  res.json({userid: session.userid});
});

//logout exit
app.get('/user/logout', (req, res) => {
  req.session.destroy();
  res.status(200).send('Session deleted');
});

app.listen(port, () =>
  console.log(`Books Server listening on port ${port}`)
)