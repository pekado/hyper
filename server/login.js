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
function validarUsuario(user, password, cbOK, cbErr) {
  console.log(user)
  // Se conecta al motor de base de datos
  MongoClient.connect(dbURL, (err, client) => {

    // Trae referencia a la base
    const db = client.db("hyper");

    // Trae referencia a la colección
    const collUser = db.collection("users");

    // Busca todos los documentos en la colección que coincidan con el criterio
    // de username y password enviado.
    collUser.find( {name: user, password: password }).toArray((err, data) => {
      if (data.length == 1) {
        // Si encontró un solo registro con ese usuario y clave, invoco al callback de éxito
        cbOK();
      } else {
        // Si no encontró ninguno o encontró más de uno (que solo sería posible si tengo algún
        // usuario duplicado por error, pero ya que estamos), llamo al callback de error
        cbErr();
        console.log('usuario incorrecto')
      }

      client.close();
    })

  })


}

module.exports.validarUsuario = validarUsuario;