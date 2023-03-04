let ls = localStorage;
let $searchSong = document.getElementById("searchSong")
let $form = document.getElementById("btnSearch")
let $formSong = document.getElementById("btnSearchSong")
let $loader = document.getElementById("loader")
let $error = document.querySelector(".error")
let $artist = document.getElementById("artista")
let $song = document.getElementById("cancion")
let $songContent = document.getElementById("songContent")
let $artistContent = document.getElementById("artistContent")
let $defaultText = document.getElementById("defaultText")
let $formAdd = document.getElementById("formAdd")
let favoriteSongs = [];


function getSearch() {
  $searchSong.addEventListener("click", () => {
    $form.style.visibility = "visible"
    $formSong.style.visibility = "visible"
    $form.style.width = "90%"
    $formSong.style.width = "90%"
    $form.classList.add('animate__animated', 'animate__backInLeft');
    $formSong.classList.add('animate__animated', 'animate__backInLeft');
  })
}



getSearch()

function getArtist() {
  $form.addEventListener("submit", e => {
    e.preventDefault()

    $loader.style.display = "block"
    try {
      let artistAPI = `http://localhost:3000/artist`
      let artistFetch = fetch(artistAPI)
      artistFetch.then(response => {
        console.log(response)
        let respuesta = response.json()
        return respuesta;
      }).then(dataArtist => {
        console.log(dataArtist)
        let artist = e.target.artist.value
        $loader.style.display = "none";

        for (const key in dataArtist) {

          if (artist === dataArtist[key].name) {
            console.log(dataArtist[key].name)
            $defaultText.style.display = "none"

            $artistContent.innerHTML = `
                        <h1 class="card text-bg-dark p-2">${dataArtist[key].name}</h1>

                        <div class="infoArtist d-flex">
                        <img src="${dataArtist[key].picture}">
                        <p style="padding: 10px; font-size: 1.5vw">${dataArtist[key].info}</p>
                        </div>

                        <div class="tableArtist d-flex">
                            <table class="table table-dark table-hover w-50" style="font-size:30px;">
                                <thead class="table-dark table-hover">
                                    <td>Genero</td>
                                    <td>${dataArtist[key].genres}</td>
                                </thead>
                                <thead class="table-dark table-hover">
                                    <td>Fecha de nacimiento</td>
                                    <td>${dataArtist[key].date}</td>
                                </thead>
                                <thead class="table-dark table-hover">
                                    <td>Pais</td>
                                    <td>${dataArtist[key].country}</td>
                                </thead>
                            </table>
                            <div class="spotifyLink">
                              <a href="${dataArtist[key].artistLink} target="_blank">
                                <h3 class="text-bg-success p-2 rounded-pill">Visitar perfil del artista en Spotify</h3>
                              </a>
                              <img class="imgSpotify rounded-circle" src="${dataArtist[key].pictureSpotify}" width ="100vw">
                              <i class="fa-brands fa-spotify d-block"></i>
                            </div>
                            <div></div>
                        </div>
                        
                        
                        `

            $loader.style.display = "none"

            let fans = document.createElement("table")
            fans.classList.add("table", "table-dark", "table-hover", "w-70", "m-auto", "mt-5", "rounded-pill")
            fans.style.fontSize = "30px"
            setInterval(() => {
              if (dataArtist[key].fans > 500000) {
                fans.innerHTML = ` <thead class="table-warning table-hover">
                                <td>Oyentes</td>
                                <td>${dataArtist[key].fans += 3}</td>
                            </thead>`
              } if (dataArtist[key].fans < 500000) {
                fans.innerHTML = ` <thead class="table-dark table-hover">
                                <td>Oyentes</td>
                                <td>${dataArtist[key].fans -= 3}</td>
                            </thead>`
              }
            }, 1200);
            $artistContent.appendChild(fans)


            return;
          } else {
            $defaultText.style.display = "none"
            $artistContent.innerHTML = `
                        <div class="intro">
                        <h1 class="animate__animated animate__fadeIn card text-bg-dark p-3 text-center">¡Lo siento! No se encontro resultados para "${artist}."</h1>
                        <h1 class="animate__animated animate__fadeIn card text-bg-dark p-3 text-center mt-2">¿Te gustaria agregar un nuevo artista? "</h1>
                        <h1 class="animate__animated animate__fadeIn text-center">⬇️ ⬇️ ⬇️ </h1>
                        </div>
                        `
            $formAdd.style.display = "block"
            $artistContent.appendChild($formAdd)

            $formAdd.addEventListener("submit", function (event) {
              event.preventDefault();
              addArtist();
              $formAdd.removeEventListener("submit", addArtist);
            });
          }
        }

      })
    } catch (error) {
      console.log(error)
      let mensaje = error.statusText || "Se produjo un error"
      $error.innerHTML = `<h2>Tipo de error ${error.status}: ${mensaje}</h2>`
      $loader.style.display = "none"
    }
  })
}

function addArtist() {
  let name = document.getElementById("artistName").value;
  let picture = document.getElementById("artistPicture").value;
  let info = document.getElementById("artistInfo").value;
  let genres = document.getElementById("artistGenres").value;
  let date = document.getElementById("artistDate").value;
  let country = document.getElementById("artistCountry").value;

  let newArtist = {
    "name": name,
    "picture": picture ? picture : "https://i.ibb.co/xfWLG7g/vector-sign-of-people-icon.jpg",
    "info": info,
    "genres": genres,
    "date": date ? date : "Sin información",
    "country": country,
    "fans": 0
  };


  // Leer el archivo JSON
  fetch("http://localhost:3000/artist")
    .then(response => response.json())
    .then(data => {
      let artists = data;

      // Verificar si el artista ya existe en el arreglo
      let artistExists = artists.some(artist => artist.name === newArtist.name);

      if (!artistExists) {
        // Agregar el nuevo artista utilizando el método POST
        fetch("http://localhost:3000/artist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newArtist)
        })
          .then(() => {
            swal("El artista fue agregado correctamente", "Ok", "success");
          })
          .catch(error => {
            console.error("Error al escribir en el archivo JSON:", error);
          });
      } else {
        // Actualizar el artista existente utilizando el método PUT
        let existingArtist = artists.find(artist => artist.name === newArtist.name);
        existingArtist.picture = newArtist.picture;
        existingArtist.info = newArtist.info;
        existingArtist.genres = newArtist.genres;
        existingArtist.date = newArtist.date;
        existingArtist.country = newArtist.country;

        fetch(`http://localhost:3000/artist/${existingArtist.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(existingArtist)
        })
          .then(() => {
            swal("El artista fue actualizado correctamente", "Ok", "success");
          })
          .catch(error => {
            console.error("Error al actualizar el archivo JSON:", error);
          });
      }
    })
    .catch(error => {
      console.error("Error al leer el archivo JSON:", error);
    });
}




getArtist()

function getSong() {
  $formSong.addEventListener("submit", e => {
    e.preventDefault()
    $loader.style.display = "block"

    try {
      let songAPI = `./json/TracksExport.json`
      let songFetch = fetch(songAPI)

      songFetch.then(response => {
        return response.json()

      }).then(dataSong => {
        console.log(dataSong)
        let song = e.target.song.value
        $loader.style.display = "none";
        for (const key in dataSong) {
          if (song === dataSong[key].title) {
            let songObject = {
              title: dataSong[key].title,
              artist: dataSong[key].artist,
              duration: dataSong[key].duration
            };
            $defaultText.style.display = "none"

            $songContent.innerHTML = `
                        <div class="contentSong">
                            <div class="intro">
                                <h1 class="animate__animated animate__fadeIn card text-bg-success p-3 text-center" style="font-family: 'Arial', sans-serif;">Información solicitada</h1>
                            </div>

                            <h2 class="card text-bg-success p-3 text-center animate__animated animate__fadeIn" style="font-family: 'Arial', sans-serif; margin-top: 30px;">Álbum</h2>
                            
                            <div class="contentImage d-flex justify-content-center m-10">
                                <img class="shadow-lg p-3 bg-body rounded animate__animated animate__fadeIn" src="${dataSong[key].picture}" style="max-width: 100%; height: auto;">
                            </div>

                            <div class="contentCard d-flex justify-content-center animate__animated animate__fadeIn" style="font-family: 'Arial', sans-serif;">
                                <div class="card text-bg-success p-3 text-dark p-3" style="margin-right: 10px;">
                                <h2>Canción:</h2>
                                <p style="font-size: 20px;">${dataSong[key].title}</p>
                                </div>
                                <div class="card text-bg-success p-3 text-dark p-3">
                                <h2>Artista:</h2>
                                <p style="font-size: 20px;">${dataSong[key].artist}</p>
                                </div>
                            </div>

                            <div class="like">
                                <i class="iconLike fa-regular fa-heart" id="iconLike"></i>
                                <h6 class="p-3 text-center" style="font-family: 'Arial', sans-serif; margin-top: 10px;">Agregar esta canción a la lista de canciones</h6>
                            </div>

                            <div class="contentLink">
                                <a href="${dataSong[key].artistLink}" class="animate__animated animate__fadeIn" style="font-family: 'Arial', sans-serif;" target="_blank">Visitar perfil del artista en Spotify</a>
                            </div>

                            <div class="alertSong alert alert-success alert-dismissible fade show animate__animated animate__fadeIn" role="alert" id="alertSong" style="font-family: 'Arial', sans-serif; margin-top: 20px; margin-bottom: 0;">
                                Se ha agregado a la <strong>lista de canciones</strong>.
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>

                            <div class="alertSongDelete alert alert-danger alert-dismissible fade show" role="alert" id="alertSongDelete" style="font-family: 'Arial', sans-serif; margin-top: 20px; margin-bottom: 0;">
                                Se ha eliminado de la <strong>lista de canciones</strong>.
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>

                            <h1 class="bg-dark text-light text-center" style="font-family: 'Arial', sans-serif; margin-top: 30px; padding: 10px;">Lista de canciones</h1>
                        </div>`

            buttonLike(songObject)
            return;
          } else {
            console.log("Tracks disponibles: ")
            console.log(dataSong[key].title + "-" + dataSong[key].artist)
            $defaultText.style.display = "none"
            $songContent.innerHTML = `
                        <div class="intro">
                        <h1 class="animate__animated animate__fadeIn card text-bg-primary p-3 text-center">¡Lo siento! No se encontro la cancion que buscas</h1>
                        </div>
                        `
          }
        }
      })

    } catch (error) {
    }
  })
}

getSong()

function buttonLike(song) {
  let iconLike = document.querySelector("#iconLike");
  let alertConfirm = document.querySelector("#alertSong");

  function handleLikeClick() {
    addToFavorites(song);
    iconLike.classList.add("animate__animated", "animate__rubberBand");
    iconLike.classList.remove('fa-regular');
    iconLike.classList.add('fa-solid');
    alertConfirm.style.display = "block";
    alertConfirm.classList.add("animate__animated", "animate__fadeIn");
    setTimeout(() => {
      iconLike.classList.remove("animate__animated", "animate__rubberBand");
      iconLike.classList.add('fa-regular');
    }, 1000);
    renderFavorites();

    // Remover el evento click después de que se hace clic una vez
    iconLike.removeEventListener("click", handleLikeClick);
  }

  // Agregar el evento click
  iconLike.addEventListener("click", handleLikeClick);
}


function addToFavorites(song) {
  favoriteSongs.push(song);
  localStorage.setItem("favoriteSongs", JSON.stringify(favoriteSongs));
}

function renderFavorites() {
  let favoriteSongsList = document.querySelector("#favoriteSongsList");
  favoriteSongs = JSON.parse(localStorage.getItem("favoriteSongs")) || [];

  favoriteSongsList.innerHTML = "";

  if (favoriteSongs.length > 0) {
    favoriteSongs.forEach((song, index) => {
      let songElement = document.createElement("tbody");
      songElement.innerHTML = `<tr>
                                    <th scope="col">${song.title}</th>
                                    <th scope="col">${song.artist}</th>
                                    <th scope="col">${song.duration}</th>
                                    <th scope="col text-end"><button class="btn btn-danger btn-sm" id="deleteButton_${index}">Eliminar</button></th>
                                </tr>`
      favoriteSongsList.appendChild(songElement);

      // Agregar un manejador de eventos al botón "eliminar" para eliminar la canción correspondiente de la lista de favoritos
      let deleteButton = document.querySelector(`#deleteButton_${index}`);
      deleteButton.addEventListener("click", () => {
        favoriteSongs.splice(index, 1);
        localStorage.setItem("favoriteSongs", JSON.stringify(favoriteSongs));
        renderFavorites();
      });
    });
  } else {
    favoriteSongsList.innerHTML = `<h4 class="text-center">No hay canciones favoritas<h4>`;
  }
}


window.addEventListener("load", () => {
  renderFavorites();
});





