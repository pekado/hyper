const express = require("express");
const router = express.Router();
const { client } = require("../db");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function(req, file, cb) {
    cb(null, req.body.name + file.originalname);
  }
});

var upload = multer({ storage: storage });

//ruta del boton registrar a las vista registrar
router.get("/registrar", (req, res) => {
  res.render("registrar", {
    title: "Registrate",
    signout: true,
    usuario: req.session.userId
  });
});

router.post("/regform", upload.single("image"), function(req, res) {


  const reqBodys = {
    name: req.body.name,
    password: req.body.password,
    mail: req.body.email,
    image: req.file.filename
  };

  console.log(client);
  // conecto al cliente
  client.connect(function(error, client) {
    // ingreso la database que usare
    const db = client.db("hyper");
    // ingreso la coleccion que usare
    const coleccion = db.collection("users");

    const nombrevalidar = req.body.name;

    // filtro si encuentro algun usuario con el mismo nombre me traigo ese array
    coleccion
      .find({ usuario: nombrevalidar })
      .toArray(function(err, datavalidacion) {
        // si encuentro un usuario con el mismo nombre mando un console.log si no inserto los nuevos datos del usuario en else
        if (datavalidacion.length == 1) {
          let errorvalidacion = `Error nombre de usuario utilizado:  ${req.body.usuario}`;
          res.render("registrar", {
            error: errorvalidacion
          });
        } else {
          // obtengo la coleccion con "insertOne" inserto a MongoDB
          coleccion.insertOne(reqBodys, (err, result) => {
            // redirect al login para logearse
            res.redirect("/login");
          });
        }
      });
  });
});

module.exports = router;
