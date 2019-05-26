const express = require ('express');
const app = express();
const exphbs = require ('express-handlebars')
const path = require ('path')
const bodyParser = require('body-parser');
const login = require('./login');

// Obtenemos el objeto MongoClient
const MongoClient = require('mongodb').MongoClient

// Configuramos la url dónde está corriendo MongoDB, base de datos y nombre de la colección
const url = mongodb.MongoClient.connect('mongodb://localhost:27017',{ useNewUrlParser: true });
const db = 'Hyper';
const collection = 'Usuarios';

// Creamos una nueva instancia de MongoClient
const client = new MongoClient(url);

// Utilizamos el método connect para conectarnos a MongoDB
client.connect(function (err, client) {
  
    // Acá va todo el código para interactuar con MongoDB
  console.log("Conectados a MongoDB");
  
    
  });






//Configuración de vistas con Handlebars


//Ruta para que use los archivos estaticos de /Public y body parser

app.use(express.static(path.join(__dirname, '../public')));
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
  url.then(function(db) {
    db.collection('Usuarios').find({}).toArray().then(function(feedbacks) {
        res.status(200).json(feedbacks);
    });
});
})

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
        res.send('/home');
      } else {
        res.sendStatus(403);
      }
    } else {
      res.status(403).end();
    }
    
  });

  //post de libro a db
  app.post('/index', function (req, res) {
    url.then(function(db) {
        delete req.body._id; // for safety reasons
        db.collection('Usuarios').insertOne(req.body);
    });    
    res.send('Data received:\n' + JSON.stringify(req.body));
});


//Servidor en puerto
app.listen (3001, () => {
    console.log("estamos vivos en el 3001")
});




