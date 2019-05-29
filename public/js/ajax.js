var arrayResumido 
var filaLibro

function getBooks() {
  
  let titleId = document.getElementById('titleId').value
  
  let xhr = new XMLHttpRequest();
    
    xhr.onload = function () {
      
      document.getElementById('titleList').innerHTML = '';
      

      let arrayOriginal = JSON.parse(xhr.responseText).items;
      
        arrayResumido = arrayOriginal.map(elemento=>{
          return {
            titulo: elemento.volumeInfo.title,
            autores: (elemento.volumeInfo.authors) ? elemento.volumeInfo.authors.join(', ')  : '<NO INFORMADO>',
            editorial: elemento.volumeInfo.publisher,
            lanzamiento: elemento.volumeInfo.publishedDate
          }
       });

       for (let index = 0; index < arrayResumido.length; index++) {
         
         filaLibro = `<ul class="bookfound"><li>${arrayResumido[index].titulo}</li><li>${arrayResumido[index].autores}</li><li>${arrayResumido[index].editorial}</li><li>${arrayResumido[index].lanzamiento}</ul><br><button class="button" onclick='addBook(${index})'>Agregar Libro</button><hr>`
         document.getElementById('titleList').innerHTML += filaLibro;
       }
       
       // arrayResumido.forEach(libro => {

         // let filaLibro = `<ul class="bookfound"><li>${libro.titulo}</li><li>${libro.autores}</li><li>${libro.editorial}</li><li>${libro.lanzamiento}</ul><br><button class="button" onclick='addBooks()'>Agregar Libro</button><hr>` // con más datos, claro...	
          //document.getElementById('titleList').innerHTML += filaLibro; // Concateno la fila en el innerHTML de la tabla (Esto se puede hacer de mil maneras distintas)
        //});
      
      console.log(arrayResumido)
    }
    xhr.open('GET', `https://www.googleapis.com/books/v1/volumes?q=${titleId}`);
    xhr.send('');
  }
  
  function addBook(index) {
        
    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
    xmlhttp.onreadystatechange = function() {
      
        if (this.readyState == 4 && this.status == 200) {
          console.log(arrayResumido)
           
        }
     };
          xmlhttp.open("POST", "/agregarlibro");
          xmlhttp.send(arrayResumido.titulo);
          
    }
              
 
    



