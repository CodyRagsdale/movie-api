# movie-api

![Node.js CI](https://github.com/CodyRagsdale/movie-api/workflows/Node.js%20CI/badge.svg) ![License](https://img.shields.io/badge/license-MIT-green)

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Technologies](#technologies)
4. [Setup](#setup)
5. [Usage](#usage)
6. [API Documentation](#api-documentation)
7. [Testing](#testing)
8. [Contributing](#contributing)
9. [License](#license)

## Introduction

Welcome to `movie-api`, a robust server-side component that powers the "myFlix" web application. Written in JavaScript, this API is built using a robust stack featuring Node.js, Express, and MongoDB. The API serves as the backbone for managing movie data, user profiles, and other essential features for myFlix. It is designed to be easily extensible and works seamlessly with front-end projects that consume its services.

This project serves as the API layer for two front-end projects:

- [Angular Movie Project](https://github.com/CodyRagsdale/angularmovieproject) - An Angular and Angular Material-based front-end.  
  **Demo**: [Live on gh-pages](https://codyragsdale.github.io/angularmovieproject/movies)
- [myFlix-client](https://github.com/CodyRagsdale/myFlix-client) - A React-based front-end for myFlix.  
  **Demo**: [Live on Netlify](https://myflixmovieproject.netlify.app/)

## Features

- User Authentication (Sign Up, Log In, Log Out)
- CRUD operations for Movies and Users
- Add/Remove movies to/from a user's list of favorites
- Secure routes with JWT Authentication
- Comprehensive filtering and search features

## Technologies

- JavaScript
- Node.js
- Express.js
- MongoDB
- JWT for Authentication

## Setup

#### Prerequisites

- Node.js
- MongoDB

#### Installation

1. Clone this repository:
   git clone https://github.com/CodyRagsdale/movie-api.git

2. Navigate to the project directory:
   cd movie-api

3. Install dependencies:
   npm install

4. Start the server:
   npm start

## Usage

After starting the server, you can use the following base URL to access the API endpoints:
http://localhost:PORT/

## API Documentation

Detailed documentation for individual files (`auth.js`, `index.js`, `passport.js`, `models.js`) can be found in the `out` folder. Additionally, a `documentation.html` file for an HTML-based view of the API documentation is available in the `public` folder.

- `global.html`: Contains information about global variables, helpers, or functions used throughout the codebase.
- `index.html`: Serves as a home page for the detailed API documentation.

## Contributing

Feel free to fork this repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.
