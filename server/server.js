const express = require ('express');
const app = express();
const exphbs = require ('express-handlebars')
const path = require ('path')
const bodyParser = require('body-parser');
const login = require('./login');


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

app.use(express.static(path.join(__dirname, '../public')));

//te transforma todo en json body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//Seteo para que use hbs como engine, con layout main y la dirección a views/layout
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '../views/layout')
}));

//seteo de las vistas

app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, '../views'));


//Ruta del home como vista inicial
app.get('/', (req,res)=> {
    res.render('home', {
        title:'Hyper - Un hiperbvínculo en tu biblioteca',
        cssHome: 'css/style.css',
    });
});


//Ruta a Index
app.get('/index', (req,res) =>{
  res.render('index',{
    title: 'Hyper',
  })

}); 


//Ruta del boton home al home
app.get('/home', (req,res)=> {
    res.render('home', {
        title:'Hyper - Un hiperbvínculo en tu biblioteca',
        cssHome: 'css/style.css',
    });
});


//ruta del boton registrar a las vista registrar
app.get('/registrar', (req,res)=>{
    res.render('registrar', {
        title: 'Registrate',
        cssRegistrar: 'css/registrar.css',
    })
});

//ruta a la selección de gustos literarios
app.get ('/gustos', (req,res) =>{
    res.render('gustos', {
        title: 'Gustos Literarios',
        cssGustos: 'css/gustos.css',
        scriptJquery: '<script type = "text/javascript"src = "https://code.jquery.com/jquery-2.1.1.min.js"></script>',
    })
});


//ruta al login
app.get ('/login', (req,res) =>{
  res.render('login', {
    cssHome: 'css/style.css',
    jsIndex: 'js/index.js',
    title: 'Ingresa'
  })
});

// POST /login
app.post('/login', (req, res) => {
    console.log(req.body);
    if (req.body.user !== undefined && req.body.password !== undefined) {
      if (login.validarUsuario(req.body.user, req.body.password)) {
        res.send('/biblioteca');
      } else {
        res.sendStatus(403);
      }
    } else {
      res.status(403).end();
    }
    
  });





app.post("/postfeedback", function(req, res) {

  const reqBodys ={
    username: 'admin',
    titulo: req.body.titulo,
    autor: req.body.autor,
    editorial: req.body.editorial  
  }

   // conecto al cliente
   client.connect(function(error, client) {
    // ingreso la database que usare
    const db = client.db("hyper");
    // ingreso la coleccion que usare
    const coleccion = db.collection("libros");
    coleccion.insertOne(reqBodys, (err, result) => {
      // redirect al login para logearse
        res.redirect("/index");
      });
});


  console.log(reqBodys);

  });


//post de libro a db
app.post('/agregarlibro', (req, res) => {
  
  let book = req.body

     // conecto al cliente
     client.connect(function(error, client) {
      // ingreso la database que usare
      const db = client.db("hyper");
      // ingreso la coleccion que usare
      const coleccion = db.collection("libros");
      coleccion.insertOne(book, (err, result) => {
        // redirect al login para logearse
          res.redirect("/index");
        });
  });
  

});

  //ruta para mostrar libros
  app.get('/biblioteca', (req, res) =>{
    
 

 
     // conecto al cliente
     client.connect(function(error, client) {
      // ingreso la database que usare
      const db = client.db("hyper");
      // ingreso la coleccion que usare
      const coleccion = db.collection("libros");
      let arrayDeLibros = coleccion.find().toArray(function(err, data) {
        console.log(data);
        res.render('biblioteca', {
          title: 'Tu Biblioteca',
          libros: data
        })
        });


    });
  });
    

   
  
  


//Servidor en puerto
app.listen (3001, () => {
    console.log("estamos vivos en el 3001")
})