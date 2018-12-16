require("dotenv").config();

var keys = require('./keys.js');
var axios = require('axios');
var moment = require('moment');
var Spotify = require('node-spotify-api');
var fs = require('fs');

var command = process.argv[2];

var option = process.argv[3];

choice();

function choice() {
    switch (command) {
        case 'concert-this':
            bandsInTown();
            break;
    
        case 'spotify-this-song':
            spotify();
            break;
    
        case 'movie-this':
            omdbMovie();
            break;
    
        case 'do-what-it-says':
            doWhatever();
            break;

            default:
            console.log('Command does not exist.');
    }
}

function bandsInTown() {
    var band = option.trim().split(' ').join('+');
    var url = 'https://rest.bandsintown.com/artists/' + band + '/events?app_id=codingbootcamp';

    axios.get(url).then(
        function (response) {

            var venueName = response.data[0].venue.name;
            var venueCity = response.data[0].venue.city;
            var venueCountry = response.data[0].venue.country
            var date = moment(response.data[0].datetime.split('T')[0]).format('DD-MM-YYYY');
            var time = response.data[0].datetime.split('T')[1].slice(0, 5);

            var output = `-----------------------\nName of venue: ${venueName} \nVenue location: ${venueCity}, ${venueCountry} \nDate: ${date} \nTime: ${time}\n-----------------------`;
            console.log(output);

            writeQueries(output);
        }
    );
}

function spotify() {
    var spotify = new Spotify(keys.spotify);

    var track = option.trim();

    spotify.search({ type: 'track', query: track }, function (err, data) {
        if (err) {

            var output = `----------------------- \nArtist(s): 'Ace of Base' \nSong name: 'The Sign' \nPreview URL: https://p.scdn.co/mp3-preview/4c463359f67dd3546db7294d236dd0ae991882ff?cid=f46988b237dc40998eaea02e793d3451 \nAlbum: The Sign (US Album) [Remastered] \n-----------------------`
            writeQueries(output);
            return console.log(output);
        }

        var artist = data.tracks.items[0].artists[0].name;
        artist = artist[0].toUpperCase() + artist.slice(1, artist.length);

        var song = data.tracks.items[0].name;

        var preview = '';
        if (data.tracks.items[0].preview_url === null) {
            preview = 'N/A';
        }
        else {
            preview = data.tracks.items[0].preview_url;
        }

        var album = data.tracks.items[0].album.name;

        var output = `----------------------- \nArtist(s): ${artist} \nSong name: ${song} \nPreview URL: ${preview} \nAlbum: ${album} \n-----------------------`
        console.log(output);
        writeQueries(output);
    });
}

function omdbMovie() {
    if (option) {
        var movie = option.trim().split(' ').join('+');
    }
    else {
        var movie = 'mr nobody';
    }


    var url = 'http://www.omdbapi.com/?t=' + movie + '&apikey=trilogy';

    axios.get(url).then(
        function (response) {

            var title = response.data.Title;
            var year = response.data.Year;
            var imdbRating = response.data.imdbRating;
            var rtRating = response.data.Ratings[1].Value;
            var country = response.data.Country;
            var language = response.data.Language;
            var plot = response.data.Plot;
            var actors = response.data.Actors;

            var output = `-----------------------\n Title: ${title} \nYear: ${year} \nIMDB Rating: ${imdbRating} \nRotten Tomatoes rating: ${rtRating} \nCountry: ${country} \nLanguage: ${language} \nPlot: ${plot} \nActors: ${actors} \n-----------------------`;
            console.log(output);
            writeQueries(output);
        }
    );
}

function doWhatever() {
    fs.readFile('random.txt', 'utf-8', function (err, data) {
        if (err) {
            return console.log(err);
        }

        command = data.split(',')[0];
        option = data.split(',')[1].slice(1);
        option = option.slice(0, option.length - 1)

        choice();
    })
}

function writeQueries(output) {
    fs.appendFile('log.txt', output, function(err) {

        // If the code experiences any errors it will log the error to the console.
        if (err) {
          return console.log(err);
        }
      
        // Otherwise, it will print: "movies.txt was updated!"
        console.log('log.txt was updated!');
      
      });
}