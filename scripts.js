//create map from leaflet.js
const mymap = L.map('mapid').setView([39.5, -98.5], 4);
//add a tile layer from OpenStreetMaps
const tiles = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
	maxZoom: 20,
	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});
tiles.addTo(mymap);
//play and universal volume

const playSound = (sound) => {
    sound.play();
}
Howler.volume(0.8);

const defaultsound = new Howl({
    src: `sounds/0.mp3`,
    html5: false,
    autoplay: false,
    loop: true,
    volume: 0.75,
});
mymap.addEventListener('mouseover', () => {
    defaultsound.play();
});
mymap.addEventListener('mouseout', () => {
    defaultsound.stop();
});
//create array from sound source
const numSounds = 8;
const sounds = Array.from({ 
    length: numSounds}, (e, i) => new Howl({ 
        src: `sounds/${i}.mp3`, 
        html5: false, 
        autoplay: false,
        volume: 0.9, 
        loop: false
}));
//fetch API data
const api_url = "https://api.openaq.org/v1/measurements?date_from=2020-09-01&format=json&limit=1500&parameter=pm25&coordinates=39.5,-98.5&radius=2500000"
async function getOpenAQ() {
    const response = await fetch(api_url);
    const data = await response.json();
    //Create array for coordinates and pm25 value
    // const CoordArray = new Array();
    data.results.forEach(result => {
        const { latitude, longitude } = result.coordinates;
        const value = result.value;
        // CoordArray.push({latitude, longitude, value});
        const circle = L.circle([latitude, longitude], {
            stroke: false,
            color: '#ffd30f',
            fillColor: '#e87604',
            fillOpacity: 0.5,
            radius: 750*value
        })
        if (value<200) {
            circle.addTo(mymap);
        }
        else {
            console.log('Too Big')
        };
        function onCircleHover() {
            if (value < 15.0) {
                playSound(sounds[1]);
            }
            else if (value < 20.0){
                playSound(sounds[2]);
            }
            else if (value < 25.0){
                playSound(sounds[3]);
            }
            else if (value < 35.0){
                playSound(sounds[4]);
            }
            else if (value < 40.0){
                playSound(sounds[5]);
            }
            else if (value < 50.0){
                playSound(sounds[6]);
            }
            else {
                playSound(sounds[7]);
            }
        };
        circle.on('mouseover', onCircleHover);
    });
    //console.log(latitude, longitude)  
    console.log(data);
}
getOpenAQ()

const input = document.querySelector('.container');

// Using the Click Event
// input.addEventListener('click', function() {
//     const display = console.log("I got clicked");
//     const defaultsoundOff = defaultsound.stop();
//     const soundOff = sound.stop()
    
// });