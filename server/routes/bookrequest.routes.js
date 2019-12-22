const express = require('express')
const router = express.Router();
const dbURL = "mongodb://localhost:27017";
const {
    client,
    mongodb
} = require('../db')

router.post("/bookrequest", (req, res) => {
    // Si no hay sesión, devuelvo un 403 ("no autorizado")
    if (req.session.userId == undefined) {
        res.status(403).redirect("/login");
    } else {
        // conecto al cliente
        client.connect(function (error, client) {
            // ingreso la database que usare
            const db = client.db("hyper");
            // ingreso la coleccion que usare
            const coleccion = db.collection("requests");
            let request = {
                name: req.body.name,
                book: req.body.title,
                req: `Tienes un solicitud de intercambio por parte de ${req.session.userId}`
            };

            coleccion.insert(request, (err, result) => {
                res.redirect("/buscador")
            });

        });
    }
});


module.exports = router;