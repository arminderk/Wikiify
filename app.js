const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// App Routes
const routes = require('./routes');

// Init App (Express)
const app = express();

// Use Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Set the Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Use App Routes in Express
app.use('/', routes);

// Start the Server
app.listen(3000, () => console.log('Server started on http://localhost:3000'));