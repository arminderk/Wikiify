const sqlite3 = require('sqlite3');
const Promise = require('bluebird');

class Connection {
    constructor(filePath) {
        this.db = new sqlite3.Database(filePath, (error) => {
            if(error) {
                console.log('Could not connect to the db', error);
            }
            else {
                console.log('Connected to the db');
            }
        });
    }

    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, result) => {
                if (err) {
                    console.log('Error running sql: ' + sql);
                    console.log(err);
                    reject(err);
                } 
                else {
                    resolve(result);
                }
            });
        });
    }

    all(sql, params = []) {
        return new Promise((resolve, reject) => {
          this.db.all(sql, params, (err, rows) => {
            if (err) {
              console.log('Error running sql: ' + sql);
              console.log(err);
              reject(err);
            } else {
              resolve(rows);
            }
          });
        });
    }

    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (err) {
              if (err) {
                console.log('Error running sql ' + sql);
                console.log(err);
                reject(err);
              } else {
                resolve({ id: this.lastID });
              }
            });
        });
    }
}

module.exports = Connection;