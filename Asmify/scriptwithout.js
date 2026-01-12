// function for search button
function searchbtn() {
  const search = document.getElementById("searchBar");
  let searchFlag = "off";

  search.addEventListener("click", () => {
    if (window.innerWidth < 1025) {
      if (searchFlag == "on") {
        search.nextElementSibling.style.display = "none";
        search.style.width = "24px";
        if (window.innerWidth < 601) {
          search.style.width = "18px";
        }
        searchFlag = "off";
      } else {
        search.nextElementSibling.style.display = "flex";
        search.style.width = "28px";
        searchFlag = "on";
      }
    }
  });
}

if (window.innerWidth < 1025) {
  searchbtn();
  console.log("Width is less than 1025px");
}

// for less than 768 screen
if (window.innerWidth < 821) {
  const hamburger = document.querySelector(".hamburger");
  const dropdown = document.querySelector(".dropdown");

  hamburger.addEventListener("click", () => {
    dropdown.style.display =
      dropdown.style.display === "block" ? "none" : "block";
  });
}

// fixing the left block for below 600px
const lib = document.getElementsByClassName("library")[0];
const left = document.getElementsByClassName("left")[0];

lib.addEventListener("click", () => {
  const currentLeft = getComputedStyle(left).left;
  left.style.left = currentLeft == "-400px" ? "10px" : "-400px";
});
const closeLeft = document.getElementById("closeLeft");
closeLeft.addEventListener("click", () => {
  left.style.left = "-400px";
});


async function playingSongs() {
  let as = await fetch(`./trending.json`);
  let songList = await as.json();

  for (song of songList) {


    document.getElementById(
      "heresongs"
    ).innerHTML += `<div onClick="playthis('${song.replace(/'/g,"\\'")}','trending/')" class="song flex">
                                                        <div class="thumbnail"><img src="trending/${song.split("-")[0].slice(0,-1)}.webp" alt="${song.split("-")[0]}">
                                                        </div><div class="forhover">
                                                          <div class="playbtn flex"><i class="fa-solid fa-play"></i></div>
                                                        </div>
                                                        <p>${song.split("-")[0]}</p>
                                                        <p>${song.split("-")[1].slice(0, -4)}</p>
                                                      </div>`;
  }
}
playingSongs();

// creating a global object
let currentSong = new Audio();
let progress;
async function playthis(song,folder) {
  console.log(folder)
   let a = await fetch(`/${folder.slice(0,-1)}.json`);
  let currentPlaylist = await a.json();
  console.log("currentSong :  " + song);
  console.log("currentPlaylist :   "+currentPlaylist)
  currentSong.src = folder+song;
  currentSong.play();
  document.getElementById('play').style.display = "none";
  document.getElementById('pause').style.display = "block";
  document.getElementById("name").innerHTML = `${song.slice(0, -4)}`;
  currentSong.addEventListener("timeupdate", () => {
    let m = Math.floor(currentSong.duration / 60);
    let s = Math.floor(currentSong.duration % 60);
    let mm = Math.floor(currentSong.currentTime / 60);
    let ss = Math.floor(currentSong.currentTime % 60);
    mm = addZero(mm);
    ss = addZero(ss);
    m = addZero(m);
    s = addZero(s);
    document.getElementsByClassName("timings")[0].innerHTML = `${mm}:${ss} / ${m}:${s}`;
    progress = (currentSong.currentTime / currentSong.duration) * 100;
    document.getElementsByClassName("circle")[0].style.left = progress + "%";
    document.getElementsByClassName("progress")[0].style.width = progress + "%";
  });
  let i = currentPlaylist.indexOf(song);
  let previous = document.getElementById('previous')
  let next = document.getElementById('next')
  if (i === 0) {
        previous.style.pointerEvents = "none";  
        previous.style.opacity = "0.5";        
    } else {
        previous.style.pointerEvents = "auto";  
        previous.style.opacity = "1";          
    }
    if (i == currentPlaylist.length-1) {
        next.style.pointerEvents = "none";  
        next.style.opacity = "0.5";        
    } else {
        next.style.pointerEvents = "auto";  
        next.style.opacity = "1";          
    }
  // auto next song
  currentSong.addEventListener("ended", () => {
    let index = currentPlaylist.indexOf(song);
    if(index!== -1&& index<currentPlaylist.length -1){
      playthis(currentPlaylist[index+1],folder);
    }
  });

// previous andd next featureee
previous.addEventListener('click',()=>{ 
  if(i>0){
    playthis(currentPlaylist[i-1],folder)
  }  
})
next.addEventListener('click',()=>{ 
  if(i < currentPlaylist.length-1){
    playthis(currentPlaylist[i+1],folder)
  }  
})
}

// progress bar must get updated when clicked on 
document.getElementsByClassName('progressBar')[0].addEventListener('click',e =>{
  progress =e.offsetX/e.target.getBoundingClientRect().width*100
  document.getElementsByClassName("circle")[0].style.left = progress +"%";
  document.getElementsByClassName("progress")[0].style.width = progress +"%";
  currentSong.currentTime= progress* currentSong.duration/100;
})



function addZero(s) {
  if (s < 10) {
    return "0" + s;
  }
  return s;
}
// onclick showall wrap
function mywrap(ids) {
  let el = document.getElementById(ids);

  // Get the current flex-wrap value
  let currentWrap = window.getComputedStyle(el).flexWrap;

  // Toggle between 'wrap' and 'nowrap'
  if (currentWrap === "wrap") {
    el.style.flexWrap = "nowrap"; // unwrap
  } else {
    el.style.flexWrap = "wrap"; // wrap
  }
}

// audio box appears only when a song is being played
currentSong.addEventListener("play", updateAudioBox);
currentSong.addEventListener("ended", updateAudioBox);
function updateAudioBox() {
  const audioBox = document.querySelector(".audioBox");
  audioBox.style.display = currentSong && !currentSong.paused ? "flex" : "none";
}

function controller() {
  const play = document.getElementById("play");
  const pause = document.getElementById("pause");
  const previous = document.getElementById("previous");
  const next = document.getElementById("next");
  const ctrl = document.getElementById("ctrl");

  ctrl.addEventListener("click", () => {
    let pdisplay = window.getComputedStyle(play).display;
    if (pdisplay == "none") {
      play.style.display = "block";
      pause.style.display = "none";
      currentSong.pause();
    } else {
      play.style.display = "none";
      pause.style.display = "block";
      currentSong.play();
    }
  });
}
controller();



//on Click on go to playlist 
async function listingPlaylists(){
  document.getElementById('rightContents').style.display ="none";
  document.querySelector('.myLibrary').style.display ="flex";
  let a = await fetch("/playlists.json");
  let myFolders = await a.json();
//   let div = document.createElement("div");
//   div.innerHTML = response;
//   let as=div.getElementsByTagName('a')
//   let myFolders =[]
//   for(a of as){
//     myFolders.push(a.innerText)
//   }
//   let b= myFolders.shift();
  document.getElementById('herePlaylists').innerHTML =""
  for(folder of myFolders){
    document.getElementById('herePlaylists').innerHTML += `<div onclick="listSongs('${folder}')" class="song flex">
                                                        <div class="thumbnail"><img src="/playlists/${folder}/cover.jpg" alt="cover"></div>
                                                        <div class="forhover">
                                                          <div class="playbtn flex"><i class="fa-solid fa-play"></i></div>
                                                        </div>
                                                        <p class="namePlaylist"> ${folder.slice(0,-1)} </p>
                                                      </div>`;
  }
}

// list you songs

async function listSongs(folder) {
  document.querySelector('.myLibrary').style.display ="none";
  document.querySelector('.myLibrarySongs').style.display ="flex";
  document.querySelector('.folerName').innerHTML = folder.slice(0,-1)
  let a = await fetch(`/playlists/${folder.slice(0,-1)}.json`);
  let currentPlaylist = await a.json();
  document.getElementById('hereMySongs').innerHTML=""
  for(song of currentPlaylist){
    document.getElementById('hereMySongs').innerHTML += `<div onClick="playthis('${song.replace(/'/g,"\\'")}','playlists/${folder}')" class="song flex">
                                                        <div class="thumbnail"><img src="playlists/${folder}/${song.split("-")[0].slice(0,-1)}.jpg" alt="${song.split("-")[0]}">
                                                        </div><div class="forhover">
                                                          <div class="playbtn flex"><i class="fa-solid fa-play"></i></div>
                                                        </div>
                                                        <p>${song.split("-")[0]}</p>
                                                        <p>${song.split("-")[1].slice(0, -4)}</p>
                                                      </div>`
  }
}

// setting the volume
function setVolume(){
  let range= document.querySelector(".range");
  range.addEventListener('change',()=>{
    console.log("Volume was changed to "+range.value)
    currentSong.volume = range.value/100;
  // if volume is 0 then noVolume is block
    if(range.value==0){
      document.querySelector(".noVolume").style.display = "inline";
      document.querySelector(".yesVolume").style.display = "none";
    }else {
      document.querySelector(".yesVolume").style.display = "inline";
      document.querySelector(".noVolume").style.display = "none";
    }
  })
}
setVolume()
// adding event listener to volume so that on click its value becomes 0
document.querySelector(".voler").addEventListener('click',()=>{
  let range=document.querySelector(".range");
  if(range.value ==0){
    range.value =10;
    currentSong.volume = range.value/100
    document.querySelector(".yesVolume").style.display = "inline";
      document.querySelector(".noVolume").style.display = "none";
  }else {
    range.value =0;
    currentSong.volume = range.value/100
    document.querySelector(".noVolume").style.display = "inline";
      document.querySelector(".yesVolume").style.display = "none";
  }
})



// adding artists
async function listArtists() {
  let a = await fetch(`/artist.json`);
  let artists = await a.json();
  for(art of artists){
    art = art.split('/')[1]
    document.getElementById('hereartist').innerHTML += `<div class="artist flex">          
                <div class="artistPic"><img src="artist/${art}" alt="${art.slice(0,-4)}"></div>
                <p>${art.slice(0,-4)}</p>
                <p>Artist</p>
              </div>`
  }
}
listArtists()

// going back too backToMyPlaylists
document.getElementById('backToMyPlaylists').addEventListener('click',()=>{
  document.querySelector('.myLibrary').style.display ="flex";
  document.querySelector('.myLibrarySongs').style.display ="none";
})

document.querySelector('.home').addEventListener('click',()=>{
  document.getElementById('rightContents').style.display ="block";
  document.querySelector('.myLibrary').style.display ="none";
  document.querySelector('.myLibrarySongs').style.display ="none";
})


// whenn less than 600px and u click on go to my library that time left thing should go away
document.querySelector('.goLibary').addEventListener('click',()=>{
  if(window.innerWidth < 601){
   left.style.left = "-400px";
  }
})


