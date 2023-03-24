const express = require('express');
const morgan = require('morgan');
const uuid = require('uuid');
const bodyParser = require('body-parser');
const cors = require('cors');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie
const Users = Models.User
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('common'));

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

//mongoose.connect('mongodb://localhost:27017/cfDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Get all movies
app.get('/movies', /*passport.authenticate('jwt', {session: false}),*/ (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Get movies by Title
app.get('/movies/:title', (req, res) => {
  Movies.findOne({ title: req.params.title })
    .then((Movie) => {
      res.json(Movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});


// Get movies by Genre
app.get('/movies/genre/:genreName', (req, res) => {
  console.log(req.params.genreName);
  Movies.findOne({ 'genre.name': req.params.genreName })
    .then((movie) => {
      res.json(movie.genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get movies by Director
app.get('/movies/directors/:directorName', (req, res) => {
  Movies.findOne({ "director.name": req.params.directorName })
    .then((movie) => {
      res.json(movie.director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Get all users
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


//Register new users
app.post('/users',
  // Validation logic here for request
  // You can either use a chain of methods like .not().isEmpty() to verify the field is not empty
  // or use .isLength({mind: 5}) to enforce a minimum character length of 5
  [
    check('username', 'username is required').isLength({ min: 5 }),
    check('username', 'username contains non alphanumeric characters - not allowed').isAlphanumeric(),
    check('password', 'password is required').not().isEmpty(),
    check('email', 'email does not appear to be valid').isEmail()
  ], (req, res) => {

  // Check the validation object for errors
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let hashedPassword = Users.hashPassword(req.body.password)
  Users.findOne({ username: req.body.username }) // Search to see if a user with the requested username already exists
    .then((user) => {
      if (user) {
        // If the user is found, send a response that it already exists
        return res.status(400).send(req.body.username + 'already exists');
      } else {
        Users
          .create({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
            birthday: req.body.birthday
          })
          .then((user) => { res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          });

      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Update a user's info, by username
/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put('/users/:username', [
  // Validation logic here for request
  check('username', 'Username is required').isLength({ min: 5 }),
  check('username', 'Username contains non-alphanumeric characters - not allowed.').isAlphanumeric(),
  check('password', 'Password is required').not().isEmpty(),
  check('email', 'Email does not appear to be valid').isEmail()
], (req, res) => {
  // Check the validation object for errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const hashedPassword = Users.hashPassword(req.body.password);

  Users.findOneAndUpdate({ username: req.params.username }, {
    $set: {
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
      birthday: req.body.birthday
    }
  },
    { new: true }) // This line makes sure the updated document is returned
    .then(updatedUser => {
      res.json(updatedUser);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Add a movie to a user's list of favorites
app.post('/users/:username/movies/:MovieID', (req, res) => {
  const username = req.params.username;
  const movieID = req.params.MovieID;

  Users.findOneAndUpdate({ username: username }, {
    $push: { favorites: movieID }
  },
  { new: true })
  .then(updatedUser => {
    res.json(updatedUser);
  })
  .catch(err => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// Remove a movie from a user's list of favorites
app.delete('/users/:username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ username: req.params.username }, {
    $pull: { favorites: req.params.MovieID }
  },
    { new: true }) // This line makes sure that the updated document is returned
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Remove a user by username
app.delete('/users/:username', (req, res) => {
  Users.findOneAndRemove({ username: req.params.username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.username + ' was not found');
      } else {
        res.status(200).send(req.params.username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port)
});