const express = require("express");
const router = express.Router();
const dbURL = "mongodb://localhost:27017";
const { client, mongodb } = require("../db");

router.post("/bookrequest", (req, res) => {
  // Si no hay sesión, devuelvo un 403 ("no autorizado")
  if (req.session.userId == undefined) {
    res.status(403).redirect("/login");
  } else {
    // conecto al cliente
    client.connect(function(error, client) {
      // ingreso la database que usare
      const db = client.db("hyper");
      // ingreso la coleccion que usare
      const coleccion = db.collection("requests");
      let request = {
        name: req.body.name,
        book: req.body.title,
        req: req.session.userId
      };

      coleccion.insertOne(request, (err, result) => {
        res.redirect("/buscador");
      });
    });
  }
});

router.post("/acceptrequest", (req, res) => {
  // Si no hay sesión, devuelvo un 403 ("no autorizado")
  if (req.session.userId == undefined) {
    res.status(403).redirect("/login");
  } else {
    // El Return es para que no siga con el resto de la función.
    // conecto al cliente
    client.connect(function(error, client) {
      // ingreso la database que usare
      const db = client.db("hyper");
      // ingreso la coleccion que usare
      const coleccion = db.collection("libros");
      //colección de requests para destruir la req aceptada
      const colrequest = db.collection("requests");
      //busca el campo categoría
      console.log(req.body.id);
      colrequest.deleteOne( { "_id" : new mongodb.ObjectId(req.body.id)}, function(err,rem) {

      arrayDeLibros = coleccion
        .find({ name: req.body.name })
        .sort({
          _id: -1
        })
        .toArray(function(err, data) {
          if (data == undefined) {
            res.send(err);
          } else {
            categorias = coleccion.distinct(
              "categoria",
              {
                categoria: {
                  $nin: ["", null]
                }
              },
              function(err, categoria) {
                res.render("buscador", {
                  title: "Encuentra tu próximo libro",
                  signin: true,
                  usuario: req.session.userId,
                  libros: data,
                  categorias: categoria
                });
              }
            );
          }
        });
    })    });
  }
  
});

module.exports = router;
