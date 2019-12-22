const express = require('express')
const router = express.Router();
const dbURL = "mongodb://localhost:27017"
const {
  client,
  mongodb
} = require('../db')

router.get("/profile", (req, res) => {
  // Si no hay sesión, devuelvo un 403 ("no autorizado")
  if (req.session.userId == undefined) {
    res.status(403).redirect("/login");
  } else {
    // El Return es para que no siga con el resto de la función.
    // conecto al cliente
    client.connect(function (error, client) {
      // ingreso la database que usare
      const db = client.db("hyper");
      // ingreso la coleccion que usare
      const coleccion = db.collection("users");
      usuario = coleccion.find({
        name: req.session.userId
      }).toArray(function (err, perfil) {
        console.log(perfil)
        const reqCol = db.collection("requests");
        reqCol.find({
          name: req.session.userId
        }).toArray(function (err, requests) {
          console.log(requests)

          res.render("profile", {
            title: "Este es tu perfil",
            signin: true,
            usuario: req.session.userId,
            perfil: perfil,
            requests: requests
          });
        });
      });
    });
  };
});

module.exports = router;