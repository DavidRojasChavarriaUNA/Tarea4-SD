"use strict";

const {
  MongoClient
} = require('mongodb');

const client = new MongoClient('mongodb+srv://UserSistDistrUNA2023:jQUTaRZdVZEtG9tg@servidorcluster.n78soj5.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

module.exports = {
  clientPromise: client.connect(),
  dbName: "Tarea4",
  collection:{
    Books:"Books",
    Authors: "Authors",
    Publishers: "Publishers"
  }
}