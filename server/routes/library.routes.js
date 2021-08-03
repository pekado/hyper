const express = require("express");
const router = express.Router();
 
const { client, mongodb } = require("../db");

router.get("/biblioteca", (req, res) => {
  // Si no hay sesión, devuelvo un 403 ("no autorizado")
  if (req.session.userId == undefined) {
    res.status(403).redirect("/login");
  } else {
    // conecto al cliente
    client.connect(function(error, client) {
      // ingreso la database que usare
      const db = client.db("hyper");
      // ingreso la coleccion que usare
      const coleccion = db.collection("libros");
      arrayDeLibros = coleccion
        .find({
          name: req.session.userId
        })
        .sort({
          _id: -1
        })
        .toArray(function(err, data) {
          console.log(data);
          res.render("biblioteca", {
            title: "Tu Biblioteca",
            libros: data,
            signin: true,
            usuario: req.session.userId
          });
        });
    });
  }
});

module.exports = router;
