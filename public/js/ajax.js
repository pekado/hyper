function getBooks() {
  
  let titleId = document.getElementById('titleId').value
  
  let xhr = new XMLHttpRequest();
    
    xhr.onload = function () {
      
      document.getElementById('titleList').innerHTML = '';
      

      let arrayOriginal = JSON.parse(xhr.responseText).items;
      
        let arrayResumido = arrayOriginal.map(elemento=>{
          return {
            titulo: elemento.volumeInfo.title,
            autores: (elemento.volumeInfo.authors) ? elemento.volumeInfo.authors.join(', ')  : '<NO INFORMADO>',
            editorial: elemento.volumeInfo.publisher,
            lanzamiento: elemento.volumeInfo.publishedDate
          }
       });
       
        arrayResumido.forEach(libro => {

          let filaLibro = `<ul><li>${libro.titulo}</li><li>${libro.autores}</li><li>${libro.editorial}</li><li>${libro.lanzamiento}</ul><hr>` // con más datos, claro...	
          document.getElementById('titleList').innerHTML += filaLibro; // Concateno la fila en el innerHTML de la tabla (Esto se puede hacer de mil maneras distintas)
        });
      
      console.log(arrayResumido)
    }
    xhr.open('GET', `https://www.googleapis.com/books/v1/volumes?q=${titleId}`);
    xhr.send('');
  }
  