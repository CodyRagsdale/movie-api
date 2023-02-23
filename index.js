const express = require('express');
const morgan = require('morgan');
const uuid = require('uuid');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(morgan('common'));

let movies = [   {
    title: 'The Warriors',
    director: 'Walter Hill',
    yearReleased: 1979,
    genre: 'Action',
    actors: ['Michael Beck', 'James Remar', 'Dorsey Wright'],
    plotSummary: 'In a dystopian future, a charismatic leader summons the street gangs of New York City in a bid to take it over. When he is killed, The Warriors are falsely blamed and now must fight their way home while every other gang is hunting them down.',
  },
  {
    title: 'True Romance',
    director: 'Tony Scott',
    yearReleased: 1993,
    genre: 'Crime',
    actors: ['Christian Slater', 'Patricia Arquette', 'Dennis Hopper'],
    plotSummary: 'In Detroit, a lonely pop culture geek marries a call girl, steals cocaine from her pimp, and tries to sell it in Hollywood. Meanwhile, the owners of the cocaine, the Mob, track them down in an attempt to reclaim it.',
  },
  {
    title: 'Cabin Boy',
    director: 'Adam Resnick',
    yearReleased: 1994,
    genre: 'Comedy',
    actors: ['Chris Elliott', 'Ritch Brinkley', 'James Gammon'],
    plotSummary: 'A foul-mouthed finishing school graduate mistakenly winds up on an ill-fated fishing boat and faces the wrath of a crew that considers him bad luck.',
  },
  {
    title: 'Black Christmas',
    director: 'Bob Clark',
    yearReleased: 1974,
    genre: 'Horror',
    actors: ['Olivia Hussey', 'Keir Dullea', 'Margot Kidder'],
    plotSummary: 'During their Christmas break, a group of sorority girls are stalked by a stranger.',
  },
  {
    title: 'City of God',
    director: 'Fernando Meirelles',
    yearReleased: 2002,
    genre: 'Drama',
    actors: ['Alexandre Rodrigues', 'Leandro Firmino', 'Phellipe Haagensen'],
    plotSummary: 'Two boys growing up in a violent neighborhood of Rio de Janeiro take different paths: one becomes a photographer, the other a drug dealer.',
  },
  {
    title: 'Everything Everywhere All at Once',
    director: 'Dan Kwan and Daniel Scheinert',
    yearReleased: 2022,
    genre: 'Science Fiction',
    actors: ['Michelle Yeoh', 'Stephanie Hsu', 'James Hong'],
    plotSummary: 'A woman must confront the multiverse version of herself to save her universe.',
  },
  {
    title: 'Troll 2',
    director: 'Claudio Fragasso',
    yearReleased: 1990,
    genre: 'Horror',
    actors: ['Michael Stephenson', 'George Hardy', 'Margo Prey'],
    plotSummary: 'A family vacationing in a strange, rural town discover that the townspeople are hiding a sinister plan.',
    },
  {
    title: 'The Room',
    director: 'Tommy Wiseau',
    yearReleased: 2003,
    genre: 'Drama',
    actors: ['Tommy Wiseau', 'Juliette Danielle', 'Greg Sestero'],
    plotSummary: 'Johnny is a successful banker who lives happily in a San Francisco townhouse with his fiancée, Lisa. One day, inexplicably, she gets bored of him and decides to seduce Johnny\'s best friend, Mark. From there, nothing will be the same again.'
    },
  {
    title: 'Profondo Rosso',
    director: 'Dario Argento',
    yearReleased: 1975,
    genre: 'Horror, Mystery, Thriller',
    actors: ['David Hemmings', 'Daria Nicolodi', 'Gabriele Lavia'],
    plotSummary: 'A jazz pianist and a wisecracking journalist are pulled into a complex web of mystery after the former witnesses the brutal murder of a psychic.'
    },
  {
    title: 'Akira',
    director: 'Katsuhiro Otomo',
    yearReleased: 1988,
    genre: 'Animation, Action, Drama',
    actors: ['Mitsuo Iwata', 'Nozomu Sasaki', 'Mami Koyama'],
    plotSummary: 'A secret military project endangers Neo-Tokyo when it turns a biker gang member into a rampaging psychic psychopath who can only be stopped by two teenagers and a group of psychics.'
   }
];

app.get('/movies', (req, res) => {
  res.json(movies);
});

app.get('/movies/:title', (req, res) => {
  const movieTitle = req.params.title;
  const movie = movies.find(m => m.title === movieTitle);
  if (movie) {
    res.json(movie);
  } else {
    res.status(404).send('Movie with title "${movieTitle}" not found.');
  }
});

app.get('/movies/genres/:genre', (req, res) => {
  const genre = req.params.genre;
  const moviesWithGenre = movies.filter(m => m.genre === genre);
  if (moviesWithGenre.length > 0) {
    res.json(moviesWithGenre);
  } else {
    res.status(404).send(`No movies found with genre "${genre}".`);
  }
});

app.get('/movies/directors/:name', (req, res) => {
  const directorName = req.params.name;
  const director = movies.find(m => m.director === directorName);
  if (director) {
    res.json(director);
  } else {
    res.status(404).send(`No director with name "${directorName}" found.`);
  }
});

app.post('/users', (req, res) => {
  let newUser = req.body;

  if(!newUser.name) {
    const message = 'Missing "name" in request body';
    res.status(400).send(message);
  } else {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).send(newUser);
  }
});

app.put('/users/:username', (req, res) => {
  res.send('Allow users to update their user info (username) $(req.params.username');
});

app.post('/users/:username/movies', (req, res) => {
  res.send('Allow users to add a movie to their list of favorites for user ${req.params.username}');
});

app.delete('/users/:username/movies/:movieID', (req, res) => {
  res.send('Allow users to remove a movie ${req.params.movieID} from their list of favorites for user ${req.params.username}');
});

app.delete('/users/:username', (req, res) => {
  res.send('Allow users to deregister (showing only a text that a user email has been removed)');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = 8080;

app.listen(port, () => {
  console.log(`Your app is listening on port ${port}.`);
});