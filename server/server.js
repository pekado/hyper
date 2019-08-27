const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const login = require("./login");
const expressSession = require("express-session");


const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
// Configuramos la url dónde está corriendo MongoDB, base de datos y nombre de la colección
const url = "mongodb://localhost:27017";

// Creamos una nueva instancia de MongoClient
const client = new MongoClient(url);

// Utilizamos el método connect para conectarnos a MongoDB
client.connect(function(err, client) {
  // Acá va todo el código para interactuar con MongoDB
  console.log("Conectados a MongoDB");

  // Luego de usar la conexión podemos cerrarla
  client.close();
});

//Configuración de vistas con Handlebars

//Ruta para que use los archivos estaticos de /Public y body parser

app.use(express.static(path.join(__dirname, "../public")));

// Manejo de sesión en Express con opciones basatante default.
app.use(
  expressSession({
    secret: "el tino es hetero",
    resave: false,
    saveUninitialized: false
  })
);

//te transforma todo en json body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Seteo para que use hbs como engine, con layout main y la dirección a views/layout
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "../views/layout")
  })
);

//seteo de las vistas

app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "../views"));

//Ruta del home como vista inicial
app.get("/", (req, res) => {
  res.render("home", {
    title: "Hyper - Un hipervínculo en tu biblioteca",
    signout: true
  });
});

//Ruta del boton home al home
app.get("/home", (req, res) => {
  res.render("home", {
    title: "Hyper - Un hipervínculo en tu biblioteca",
    signout: true
  });
});

//ruta al login
app.get("/login", (req, res) => {
  res.render("login", {
    jsIndex: "js/index.js",
    title: "Ingresa",
    signout: true
  });
});

// POST /login
app.post("/login", (req, res) => {
  if (req.body.user !== undefined && req.body.password !== undefined) {
    login.validarUsuario(
      req.body.user,
      req.body.password,
      function() {
        // Callback para invocar si validó bien. Guarda la sesión e indica navegar al home.
        req.session.userId = req.body.user;
        res.redirect("/biblioteca");
      },
      function() {
        // Si validó mal, se destruye la sesión (por si la hubiera) y redirige a página inicial
        req.session.destroy();
        res.redirect("/home");
      }
    );
  }
});

//post buscador de libro en db
app.get("/findlocalbooks", (req, res) =>{
  arrayDeLibros = [];
    client.connect(function(error, client) {
      // ingreso la database que usare
      const db = client.db("hyper");
      // ingreso la coleccion que usare
      const coleccion = db.collection("libros");
      arrayDeLibros = coleccion.find( { $elemMatch: req.body.title} ).sort({ _id: -1 }).toArray(function(err, data) {
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


// GET logout
app.get("/logout", (req, res) => {
  // Destruyo sesión y redirijo al login.
  req.session.destroy();
  res.redirect("/");
});

//ruta del boton registrar a las vista registrar
app.get("/registrar", (req, res) => {
  res.render("registrar", {
    title: "Registrate",
    signout: true,
    usuario: req.session.userId
  });
});

//ruta a buscador de libros en la db
app.get("/buscador", (req, res) => {
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
      arrayDeLibros = coleccion.find().sort({ _id: -1 }).toArray(function(err, data) {
          console.log(data);
          res.render("buscador", {
            title: "Encuentra tu próximo libro",
            signin: true,
            usuario: req.session.userId,
            libros: data
          });
        });
    });
  }
});

//Api que recoje datos del formulario que ingresa libros

app.post("/postfeedback", function(req, res) {
  const reqBodys = {
    name: req.session.userId,
    titulo: req.body.titulo,
    autores: req.body.autores,
    editorial: req.body.editorial,
    categoria: req.body.categoria
  };

  // conecto al cliente
  client.connect(function(error, client) {
    // ingreso la database que usare
    const db = client.db("hyper");
    // ingreso la coleccion que usare
    const coleccion = db.collection("libros");
    coleccion.insertOne(reqBodys, (err, result) => {
      // redirect al login para logearse
      res.redirect("/agregar");
    });
  });

  console.log(reqBodys);
});

//Api que registra usuarios

app.post("/regform", function(req, res) {
  const reqBodys = {
    name: req.body.name,
    password: req.body.password,
    mail: req.body.email
  };

  console.log(reqBodys);
  // conecto al cliente
  client.connect(function(error, client) {
    // ingreso la database que usare
    const db = client.db("hyper");
    // ingreso la coleccion que usare
    const coleccion = db.collection("users");
    coleccion.insertOne(reqBodys, (err, result) => {
      // redirect al login para logearse
      res.redirect("/login");
    });
  });

  console.log(reqBodys);
});

//Ruta a agregar
app.get("/agregar", (req, res) => {
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

//post de libro a db
app.post("/agregarlibro", (req, res) => {
  console.log(req.body);
  let book = {
    name: req.session.userId,
    titulo: req.body.titulo,
    autores: req.body.autores,
    editorial: req.body.editorial,
    categoria: req.body.categoria
  };

  // conecto al cliente
  client.connect(function(error, client) {
    // ingreso la database que usare
    const db = client.db("hyper");
    // ingreso la coleccion que usare
    const coleccion = db.collection("libros");
    coleccion.insertOne(book, (err, result) => {
      // redirect al login para logearse
    });
  });
});

//ruta para mostrar libros
app.get("/biblioteca", (req, res) => {
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
      arrayDeLibros = coleccion.find({ name: req.session.userId }).sort({ _id: -1 }).toArray(function(err, data) {
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

//Servidor en puerto
app.listen(3001, () => {
  console.log("estamos vivos en el 3001");
});
