var arrayResumido;

//Función que consigue libros en API de google

function getBooks() {
  let titleId = document.getElementById("titleId").value;

  let xhr = new XMLHttpRequest();

  xhr.onload = function() {
    document.getElementById("titleList").innerHTML = "";

    let arrayOriginal = JSON.parse(xhr.responseText).items;

    arrayResumido = arrayOriginal.map(elemento => {
      return {
        titulo: elemento.volumeInfo.title,
        autores: elemento.volumeInfo.authors ? elemento.volumeInfo.authors.join(", "): "<NO INFORMADO>",
        editorial: elemento.volumeInfo.publisher,
        lanzamiento: elemento.volumeInfo.publishedDate
      };
    });

    for (let index = 0; index < arrayResumido.length; index++) {
      filaLibro = `<ul class="bookfound"><li>${arrayResumido[index].titulo}</li><li>${arrayResumido[index].autores}</li><li>${arrayResumido[index].editorial }</li><li>${arrayResumido[index].lanzamiento}</ul><br><button class="button" onclick='addBook(${index})'>Agregar Libro</button><hr>`;
      document.getElementById("titleList").innerHTML += filaLibro;
    }

    console.log(arrayResumido);
  };
  xhr.open("GET", `https://www.googleapis.com/books/v1/volumes?q=${titleId}`);
  xhr.send("");
}

//función que agrega metadatos a la db

function addBook(index) {
  var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(arrayResumido);
    }
  };
  xmlhttp.open("POST", "/agregarlibro");
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlhttp.send(JSON.stringify(arrayResumido[index]));
}
