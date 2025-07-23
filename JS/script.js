console.log("Lets start Javascript");
let currentSong = new Audio();
let songs;
let currFolder;

// Fucntion for Show songs duration

function toMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

// Function for Fetch songList

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`${folder}/`);

  console.log("Loading folder:", folder);

  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");

  songs = [];

  for (let index = 0; index < as.length; index++) {
    const element = as[index];

    if (element.href.endsWith(".mp3") ) {
      songs.push(element.href.split(`${folder}/`)[1]);
    }
  }


  // shows all the songs in playlist

  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];

    songUL.innerHTML = "";

  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li> 
                <img class="invert" src="svg/music.svg" alt="">
                <div class="info">
                  <div>${song.replaceAll("%20", " ")}</div>
                  <div>Omkar</div>
                </div>
                <div class="playNow">
                  <span>Play Now</span> 
                  <img class="invert" src="svg/pause.svg" alt="">
                </div>
      </li>`;
  }

  

  //attach enevntListsner to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML);
    });
  });
  return songs
}

const playMusic = (track, pause = false) => {
  currentSong.src = `${currFolder}/` + track;

  if (!pause) {
    currentSong.play();
    play.src = "svg/play-button.svg";
  }
  document.querySelector(".songInfo").innerHTML = decodeURI(track);
  document.querySelector(".songTime").innerHTML = "00:00 / 00:00";

};

async function displayAlbum(){
  let a = await fetch(`songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;

  let anchors = div.getElementsByTagName("a")
  let cardContainer = document.querySelector(".cardContainer")

  console.log(cardContainer)

  console.log(anchors)

  let array = Array.from(anchors)
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    
  
    if(e.href.includes("songs/")){
      let folder = e.href.split("/").slice(-2)[1]

      // Get the data of the folder 
      let a = await fetch(`songs/${folder}/info.json`);
  let response = await a.json();

  cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
              <div class="play">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z" fill="black"/>
                </svg>                
              </div>
              <img
                src="/songs/${folder}/cover.jpg"
                alt=""
              />
              <h2>${response.title}</h2>
              <p>${response.description}</p>
            </div>`
    }

  }

   // Load playlist when card is clicked
   Array.from(document.getElementsByClassName("card")).forEach( e=> {
    e.addEventListener("click", async item=> { 
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0])
    })
  } ) 
}



// Main function

async function main() {
  await getSongs("songs/");
  playMusic(songs[0], true);

  // Display all the album on the page
  displayAlbum()

  // Event for play next and pervious

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "svg/play-button.svg";
    } else {
      currentSong.pause();
      play.src = "svg/pause.svg";
    }
  });

  // Listen for Time update Event

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songTime").innerHTML = `${toMinutesSeconds(
      currentSong.currentTime
    )}/${toMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  //seekbar event listener
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";

    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  // Add eventListener of Hamburger

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = 0;
  });

  // Add eventlistener for close hamburger
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
  });

  // Add eventlistner for next

  next.addEventListener("click", () => {
    console.log("Next clicked");

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    currentSong.src.split("/").slice(-1)[0];

    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  // Add eventlistner for previus

  previous.addEventListener("click", () => {
    console.log("previous clicked");

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    currentSong.src.split("/").slice(-1)[0];

    if ([index - 1] > 0) {
      playMusic(songs[index - 1]);
    }
  });

  // Add event for volume
  document.querySelector(".range").getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentSong.volume = parseInt(e.target.value) / 100;
    });

   // Add event for mute the track

   document.querySelector(".volume>img").addEventListener("click",e=> {

    if( e.target.src.includes("volumeMain.svg") ) {
      e.target.src = e.target.src.replace( "volumeMain.svg", "mute.svg");
      currentSong.volume = 0;
      document.querySelector(".range").getElementsByTagName("input")[0].value = 0
    } else {
      
      e.target.src = e.target.src.replace( "mute.svg", "volumeMain.svg" );
      currentSong.volume = .10;
      document.querySelector(".range").getElementsByTagName("input")[0].value = 25
    }

   })
    
}

main();
