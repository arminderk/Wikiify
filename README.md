# Wikiify

![Image](https://user-images.githubusercontent.com/20608379/113492879-cb7af800-948f-11eb-9dbf-6976cd64ac78.png)

* A database.sqlite3 file is required to save the data

* Keep in mind, I didn't develop a trigger or functionality which automatically deletes the contents in the database.sqlite3 file. When the server is initially started, there are calls to initialize the databases and insert the Main_Page contents into the database. So, if the server is restarted, there will be another entry in the database for the Main_Page.

* Another note is that wiki links are created using the original markdown syntax: \[link_name\](url). In this case the url must contain: "/page/:title" to be able to navigate to a link

## Running the app locally

``` bash
$ npm install
$ npm start (or npm run dev to run nodemon)
```
    
open localhost:3000
