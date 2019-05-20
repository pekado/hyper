function getBooks() {
  let titleId = document.getElementById('titleId').value
  
  let xhr = new XMLHttpRequest();
    
    xhr.onload = function () {
      
      

      let arrayOriginal = JSON.parse(xhr.responseText).items;
      
        let arrayResumido = arrayOriginal.map(elemento=>{
          return {
            titulo: elemento.volumeInfo.title,
            autores: (elemento.volumeInfo.authors) ? elemento.volumeInfo.authors.join(', ')  : '<NO INFORMADO>',
            editorial: elemento.volumeInfo.publisher,
            lanzamiento: elemento.volumeInfo.publishedDate
          }
       });
       arrayResumido.forEach(object => {
        document.getElementById('titleList').innerHTML = JSON.stringify(arrayResumido, null, 4)
      });
      console.log(arrayResumido)
    }
    xhr.open('GET', `https://www.googleapis.com/books/v1/volumes?q=${titleId}`);
    xhr.send('');
  }
  