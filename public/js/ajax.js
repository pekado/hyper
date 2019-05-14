function getBooks() {
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
      let arrayOriginal = JSON.parse(xhr.responseText).items;
      const bookDiv = document.createElement('div');
      
      let arrayResumido = arrayOriginal.map(elemento=>{
        return {
          titulo: elemento.volumeInfo.title,
          autores: (elemento.volumeInfo.authors) ? elemento.volumeInfo.authors.join(', ')  : '<NO INFORMADO>',
          editorial: elemento.volumeInfo.publisher,
          lanzamiento: elemento.volumeInfo.publishedDate
        }
      });
      const titleDiv = document.createElement('div').appendChild(document.createTextNode(arrayResumido));
      bookDiv.appendChild(titleDiv);
      console.log(arrayResumido)
    }
    xhr.open('GET', 'https://www.googleapis.com/books/v1/volumes?q=marx');
    xhr.send('');
  }
  