const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("hyper").collection("users");
  console.log(client)
  // perform actions on the collection object
  client.close();
});

module.exports = {client}