const express = require('express')
const router = express.Router();
const   = "mongodb://localhost:27017"
const {client, mongodb} = require('../db')

router.get("/buscador", (req, res) => {
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
        const coleccion = db.collection("libros");
        //busca el campo categoría 
        arrayDeLibros = coleccion
          .find( { "name" : { $ne: req.session.userId}})
          .sort({
            _id: -1
          })
          .toArray(function (err, data) {
            if (data == undefined) {
              res.send(err)
            } else {
              categorias = coleccion.distinct("categoria", {
                "categoria": {
                  $nin: ["", null]
                }
              }, function (err, categoria) {
  
                res.render("buscador", {
                  title: "Encuentra tu próximo libro",
                  signin: true,
                  usuario: req.session.userId,
                  libros: data,
                  categorias: categoria
                });
  
              });
            }
          })
      });
    };
  });
//search books by name in DB
  router.post("/findlocalbooks", (req, res) => {
    let reqbody = {
      title: req.body.title
    };
    console.log(reqbody);
    client.connect(function (error, client) {
      // ingreso la database que usare
      const db = client.db("hyper");
      // ingreso la coleccion que usare
      const coleccion = db.collection("libros");
      arrayDeLibros = coleccion
        .find({
          titulo: {
            $regex: req.body.title,
            $options: "i"
          }
        })
        .sort({
          _id: -1
        })
        .toArray(function (err, data) {
          JSON.stringify(data);
          console.log(data);
          res.render("buscador", {
            title: "Encuentra tu próximo libro",
            signin: true,
            usuario: req.session.userId,
            libros: data
          });
        });
    });
  });

  //Api that filter by category
router.post("/onlyonecategory", (req, res) => {
    const reqbody = req.body.category;
    console.log(reqbody);
    client.connect(function (error, client) {
      // ingreso la database que usare
      const db = client.db("hyper");
      // ingreso la coleccion que usare
      const coleccion = db.collection("libros");
      coleccion
        .find({
          categoria: {
            $regex: reqbody,
            $options: "i"
          }
        })
        .sort({
          _id: -1
        })
        .toArray(function (err, data) {
          categorias = coleccion.distinct("categoria", {
            "categoria": {
              $nin: ["", null]
            }
          }, function (err, categoria) {
            console.log(categoria);
            return res.send("/buscador", {
              title: "Encuentra tu próximo libro",
              signin: true,
              usuario: req.session.userId,
              libros: data,
              categorias: categoria
            });
          });
        });
    });
  });

  module.exports = router;