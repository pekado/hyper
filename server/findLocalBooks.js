const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const dbURL = "mongodb://localhost:27017"
userId = undefined;
/**
 * Valida usuario y clave
 * 
 * @param {string} user Usuario
 * @param {string} password Clave
 */
function findLocalBooks(title) {

  // Se conecta al motor de base de datos
  MongoClient.connect(dbURL, (err, client) => {

    // Trae referencia a la base
    const db = client.db("hyper");

    // Trae referencia a la colección
    const collUser = db.collection("libros");

    // Busca todos los documentos en la colección que coincidan con el criterio
    // de username y password enviado.
    collUser.find( {titulo: title }).toArray((err, data) => {
      if (data.length == 1) {
        document.getElementById('localbooks').innerHTML = data;
      } else {
        document.getElementById('localbooks').innerHTML = '<h6>Aún nadie agregó ese libro<h6>';
      }

      client.close();
    })

  })


}

module.exports.findLocalBooks = findLocalBooks;