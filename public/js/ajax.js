var arrayResumido;

//Función que consigue libros en API de google

function getBooks() {
  let titleId = document.getElementById("titleId").value;

  let xhr = new XMLHttpRequest();

  xhr.onload = function () {
    document.getElementById("titleList").innerHTML = "";

    let arrayOriginal = JSON.parse(xhr.responseText).items;

    arrayResumido = arrayOriginal.map(elemento => {
      return {
        titulo: elemento.volumeInfo.title,
        autores: elemento.volumeInfo.authors ? elemento.volumeInfo.authors.join(", ") : "<NO INFORMADO>",
        editorial: elemento.volumeInfo.publisher,
        lanzamiento: elemento.volumeInfo.publishedDate,
        categoria: elemento.volumeInfo.categories ? elemento.volumeInfo.categories.join(", ") : "Sin Categoria"
      };
    });

    for (let index = 0; index < arrayResumido.length; index++) {
      filaLibro = `<div class="cadalibro padding hoverable"><ul class="bookfound"><li>Título: ${arrayResumido[index].titulo}</li><li>Autor/es: ${arrayResumido[index].autores}</li><li>Editorial: ${arrayResumido[index].editorial }</li><li>Lanzamiento: ${arrayResumido[index].lanzamiento}<li>Categoría: ${arrayResumido[index].categoria}</li></ul><br><button class="waves-effect waves-light btn pink darken-1 right" onclick='addBook(${index})'>Agregar Libro</button></div>`;
      document.getElementById("titleList").innerHTML += filaLibro;
    }

    console.log(arrayResumido);
  };
  xhr.open("GET", `https://www.googleapis.com/books/v1/volumes?q=${titleId}`);
  xhr.send("");
}

//función que agrega metadatos a la db

function addBook(index) {
  if (confirm(`¿Estás seguro que quieres agregar ${arrayResumido[index].titulo}?`)) {
    var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance
    xmlhttp.onreadystatechange = function () {

      if (this.readyState == 4 && this.status == 200) {
        console.log(arrayResumido);
      }

    }
    xmlhttp.open("POST", "/agregarlibro");
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify(arrayResumido[index]));
  };
}

//función que acepta la solicitud

function getByCategory() {
  let titleId = document.getElementById("titleId").value;

  let xhr = new XMLHttpRequest();

  xhr.onload = function () {
    document.getElementById("books").innerHTML = "";

    let arrayOriginal = JSON.parse(xhr.responseText).items;

    arrayResumido = arrayOriginal.map(elemento => {
      return {
        titulo: elemento.volumeInfo.title,
        autores: elemento.volumeInfo.authors ? elemento.volumeInfo.authors.join(", ") : "<NO INFORMADO>",
        editorial: elemento.volumeInfo.publisher,
        lanzamiento: elemento.volumeInfo.publishedDate,
        categoria: elemento.volumeInfo.categories ? elemento.volumeInfo.categories.join(", ") : "Sin Categoria"
      };
    });

    for (let index = 0; index < arrayResumido.length; index++) {
      filaLibro = `<div class="cadalibro padding hoverable"><ul class="bookfound"><li>Título: ${arrayResumido[index].titulo}</li><li>Autor/es: ${arrayResumido[index].autores}</li><li>Editorial: ${arrayResumido[index].editorial }</li><li>Lanzamiento: ${arrayResumido[index].lanzamiento}<li>Categoría: ${arrayResumido[index].categoria}</li></ul><br><button class="waves-effect waves-light btn pink darken-1 right" onclick='addBook(${index})'>Agregar Libro</button></div>`;
      document.getElementById("titleList").innerHTML += filaLibro;
    }

    console.log(arrayResumido);
  };
  xhr.open("GET", "http://localhost:3001/onlyonecategory");
  xhr.send("");
}
