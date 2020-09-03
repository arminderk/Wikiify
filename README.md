# Wiki Engine - Arminder Khinda

* A database.sqlite3 file is required to save the data

* Keep in mind, I didn't develop a trigger or functionality which automatically deletes the contents in the database.sqlite3 file. When the server is initially started, there are calls to initialize the databases and insert the Main_Page contents into the database. So, if the server is restarted, there will be another entry in the database for the Main_Page.

* Another note is that wiki links are created using the original markdown syntax: \[link_name\](url). In this case the url must contain: "/page/" to be able to navigate to a link

In order to run the app, simply type the commands below:
    $ npm install
    $ npm start (or npm run dev to run nodemon)
    $ open http://localhost:3000