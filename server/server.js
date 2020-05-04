const cors = require("cors");
const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const { client, mongodb } = require("./db");

app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
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
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
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

//  /login
app.use("/", require("./routes/login.routes"));

//Register
app.use("/", require("./routes/register.routes"));

//ruta a buscador de libros en la db
app.use("/", require("./routes/library.routes"));

//add books
app.use("/", require("./routes/addbook.routes"));

app.use("/", require("./routes/profile.routes"));

app.use("/", require("./routes/search.routes"));

app.use("/", require("./routes/bookrequest.routes"));

//Servidor en puerto
app.listen(3001, () => {
  console.log("estamos vivos en el 3001");
});
