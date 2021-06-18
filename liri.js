require("dotenv").config();
var keys = require("./key");
var twitter = require("twitter");
var omdb =  require("omdb");
var request = require("request");
var fs = require("fs");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);


const { argv } = require("process");
var argArr = process.argv ; 



function Main(argument){

     switch(argument) {
        case "my-tweets":
            getTweets();
            break ; 

        case "spotify-this-song":
            SpotifySearch(argArr[3]);
            break ;

        case "movie-this":
            GetMovie(argArr[3]);
            break ; 

        case "do-what-it-says":
            whatItSays();
            break ; 
        default :
        console.log("Liri didn't find this");
        break;
     }

}

function getTweets(){
    var client = new twitter(keys.twitter);


    client.get('favorites/list', function(error, tweets, response) {
        if(error) throw error;

        for(let tweet of tweets){
            if(tweet.created_at === undefined || tweet.text === undefined ){
                continue;
            }
            console.log(tweet.created_at , "\n" + tweet.text );

        }
      });
}

function SpotifySearch(songName){

    if(songName===undefined) {
        songName = "Mata Hari" 
    }

    spotify.search({ type: 'track', query: songName }, 
    function(err, data) {
        if (err) {
          return console.log('Error occurred: ' ,  err);
        }
        // console.log('DATA: ' ,  data.tracks.items); 
        var allsongs = data.tracks.items ; 
        for (let song of allsongs ){
            console.log("Name: " , song.name);
            console.log("Preview url: " , song.preview_url );
            console.log("Artist: " , song.artists.map( artist => artist.name));
            console.log("*****************************************************")
        }
    });

}

function GetMovie (movieName) {
    if (movieName === undefined) {
      movieName = "who am i";
    }
  
    var urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";
  
    request(urlHit, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var jsonData = JSON.parse(body);
  
        console.log("Title: " + jsonData.Title);
        console.log("Year: " + jsonData.Year);
        console.log("Rated: " + jsonData.Rated);
        console.log("IMDB Rating: " + jsonData.imdbRating);
        console.log("Country: " + jsonData.Country);
        console.log("Language: " + jsonData.Language);
        console.log("Plot: " + jsonData.Plot);
        console.log("Actors: " + jsonData.Actors);
        console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++")
      }
    });
};

function whatItSays(){
    fs.readFile("./random.txt" , "utf-8" , function(err,data){
        if(err){
            console.log("we have an error:" , err) ; 
            return;
        }
        console.warn(data); 
    });
    
}

for(let i=2 ; i< argArr.length ; i++){
    fs.appendFile( "./random.txt" , argArr[i] + "," , function(err){
        if(err){
            console.log("we have an error:" , err) ; 
            return;
        }
        console.log("command was written to random.txt");
    } )
}


Main(argArr[2]);