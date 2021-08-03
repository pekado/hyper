const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(error => {
  // perform actions on the collection object
  if (error) return console.log(error);
  var database = client.db("mydatabase");
  console.log("Database connected.");
  client.close();
});

module.exports = {client}