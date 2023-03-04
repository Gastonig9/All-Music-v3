const apiKey = "2ec0051e2648c2fb804013ad17543623";

function createTable() {
  const table = document.createElement("table");
  const header = table.createTHead();
  const row = header.insertRow();
  row.insertCell().textContent = "Posición";
  row.insertCell().textContent = "Artista";
  row.insertCell().textContent = "Canción más popular";
  row.insertCell().textContent = "Nacionalidad";
  row.insertCell().textContent = "Número de oyentes";
  const body = document.createElement("tbody");
  table.appendChild(body);
  document.getElementById("artist-table").appendChild(table);
  return body;
}

const tbody = createTable();

function updateTable(artists) {
  // Ordena la matriz de artistas en función del número de oyentes
  artists.sort((a, b) => b.listeners - a.listeners);

  tbody.innerHTML = "";

  artists.forEach((artist, index) => {
    const row = tbody.insertRow();
    row.insertCell().textContent = index + 1;
    row.insertCell().textContent = artist.name;
    row.insertCell().textContent = artist.toptracks && artist.toptracks.track[0].name || "N/A";
    row.insertCell().textContent = artist.country;
    row.insertCell().textContent = artist.listeners;

  });
}

fetch(`http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${apiKey}&format=json`)
  .then(response => response.json())
  .then(data => {
    const artists = data.artists.artist.slice(0, 30);
    console.log(artists)
    updateTable(artists);
    setInterval(() => {
      fetch(`http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${apiKey}&format=json`)
        .then(response => response.json())
        .then(data => {
          const artists = data.artists.artist.slice(0, 50);
          updateTable(artists);
        })
        .catch(error => console.error(error));
    }, 1000);
  })
  .catch(error => console.error(error));


