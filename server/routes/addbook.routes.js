const express = require('express')
const router = express.Router();
const dbURL = "mongodb://localhost:27017"
const {client, mongodb} = require('../db')

//Ruta a agregar
router.get("/agregar", (req, res) => {
    // Si no hay sesión, devuelvo un 403 ("no autorizado")
    if (req.session.userId == undefined) {
      res.status(403).redirect("/login");
    } else {
      // El Return es para que no siga con el resto de la función.
  
      res.render("agregar", {
        title: "Agrega títulos a tu biblioteca",
        signin: true,
        usuario: req.session.userId
      });
    }
  });

  router.post("/agregarlibro", (req, res) => {
    console.log(req.body);
    let book = {
      name: req.session.userId,
      titulo: req.body.titulo,
      autores: req.body.autores,
      editorial: req.body.editorial,
      categoria: req.body.categoria
    };
  
    // conecto al cliente
    client.connect(function (error, client) {
      // ingreso la database que usare
      const db = client.db("hyper");
      // ingreso la coleccion que usare
      const coleccion = db.collection("libros");
      coleccion.insertOne(book, (err, result) => {
       
        res.redirect("/agregar");
      });
    });
  });

  router.post("/postfeedback", function (req, res) {
    const reqBodys = {
      name: req.session.userId,
      titulo: req.body.titulo,
      autores: req.body.autores,
      editorial: req.body.editorial,
      categoria: req.body.categoria
    };
  
    // conecto al cliente
    client.connect(function (error, client) {
      // ingreso la database que usare
      const db = client.db("hyper");
      // ingreso la coleccion que usare
      const coleccion = db.collection("libros");
      coleccion.insertOne(reqBodys, (err, result) => {
        
        res.redirect("/agregar");
      });
    });
  
    console.log(reqBodys);
  });
  
  module.exports = router;