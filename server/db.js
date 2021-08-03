const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
// Configuramos la url dónde está corriendo MongoDB, base de datos y nombre de la colección
const url = process.env.MONGODB_URI;

// Creamos una nueva instancia de MongoClient
const client = new MongoClient(url);

// Utilizamos el método connect para conectarnos a MongoDB
client.connect(function (err, client) {
  // Acá va todo el código para interactuar con MongoDB
  console.log("Conectados a MongoDB");
  console.log(`${client}`);

  // Luego de usar la conexión podemos cerrarla
  client.close();
});

module.exports = {client, mongodb}