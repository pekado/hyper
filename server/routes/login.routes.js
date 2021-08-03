const express = require("express");
const router = express.Router();
 
userId = undefined;
const { client, mongodb } = require("../db");

router.get("/login", (req, res) => {
  res.render("login", {
    jsIndex: "js/index.js",
    title: "Ingresa",
    signout: true
  });
});

router.post("/login", function(req, res) {
  //conectar cliente
  client.connect(function(error, client) {
    //busco la database principal
    const db = client.db("hyper");
    //especifico la coleccion que usare
    const coleccion = db.collection("users");
    //filtro coleccion segun el nombre de usuario y password
    coleccion
      .find({ name: req.body.user, password: req.body.password })
      .toArray(function(err, data) {
        // valido que me llege 1 solo usuario
        if (data.length == 1) {
          // Si encontró un solo registro con ese usuario y clave
          // Callback para invocar si validó bien. Guarda la sesión e indica navegar al home.
          req.session.userId = data[0].name;
          req.session.userAvatar = data[0].image;
          res.redirect("/biblioteca");
        } else {
          // Si lo que ingresaste es incorrecto
          // Si validó mal, se destruye la sesión (por si la hubiera) y redirige a página inicial
          req.session.destroy();
          console.log("no entra");
          res.redirect("/login");
        }
      });
  });
});

// GET logout
router.get("/logout", (req, res) => {
  // Destruyo sesión y redirijo al login.
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
