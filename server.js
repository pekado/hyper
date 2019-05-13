const express = require ('express');
const app = express();
const exphbs = require ('express-handlebars')
const path = require ('path')
const bodyParser = require('body-parser');
// Obtenemos el objeto MongoClient
const MongoClient = require('mongodb').MongoClient

// Configuramos la url dónde está corriendo MongoDB, base de datos y nombre de la colección
const url = 'mongodb://localhost:27017';
const dbName = 'Hyper';
const collectionName = 'Usuarios';

// Creamos una nueva instancia de MongoClient
const client = new MongoClient(url);

// Utilizamos el método connect para conectarnos a MongoDB
client.connect(function (err, client) {
  
    // Acá va todo el código para interactuar con MongoDB
  console.log("Conectados a MongoDB");
  
  // Luego de usar la conexión podemos cerrarla
  
});




//Configuración de vistas con Handlebars


//Ruta para que use los archivos estaticos de /Public y body parser

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

//Seteo para que use hbs como engine, con layout main y la dirección a views/layout
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '/views/layout')
}));

//seteo de las vistas

app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, '/views'));


//Ruta del home como vista inicial
app.get('/', (req,res)=> {
    res.render('home', {
        title:'mi app hbs',
        cssHome: 'css/style.css',
    });
});

//Ruta del boton home al index
app.get('/home', (req,res)=> {
    res.render('home', {
        title:'mi app hbs',
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

// GET /title/:id


//Servidor en puerto
app.listen (3001, () => {
    console.log("estamos vivos en el 3001")
});




