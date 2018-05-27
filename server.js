const express = require('express');
const app = express();

//using this library to interface with SQLite db https://github.com/mapbox/node-sqlite3
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('web_data.db');//web data database
const db2 = new sqlite3.Database('events.db');

app.use(express.static('static_files'));

const tableDates =
    '[04_21_2018],[04_22_2018],[04_23_2018],[04_24_2018],[04_25_2018],[04_26_2018],[04_27_2018]';
/*deprecated database
const fakeDatabase = {
  'john': {socialMedia: 300, onlineTV: 100, education: 40, other: 120},
  'jenny': {socialMedia: 200, onlineTV: 200, education: 20, other: 140},
  //'Chocolate': {job: 'student',   pet: 'dog.jpg'},
  //'Carol': {job: 'engineer',  pet: 'bear.jpg'}
};
*/

// DEPRECATED - need to add a second database to be associated with
// a second user in order to look up by username
// GET a list of all usernames
//
// To test, open this URL in your browser:
//   http://localhost:3000/users
app.get('/users', (req, res) => {
  const allUsernames = Object.keys(fakeDatabase); // returns a list of object keys
  console.log('allUsernames is:', allUsernames);
  res.send(allUsernames);
});


// Needs modification to fit the new db
//
// To test, open these URLs in your browser:
//   http://localhost:3000/users/Philip
//   http://localhost:3000/users/Carol
//   http://localhost:3000/users/invalidusername
app.get('/users/:userid', (req, res) => {
  const nameToLookup = req.params.userid; // matches ':userid' above
  const val = fakeDatabase[nameToLookup];
  console.log(nameToLookup, '->', val); // for debugging
  if (val) {
    res.send(val);
  } else {
    res.send({}); // failed, so return an empty object instead of undefined
  }
});


//gets all data on given date
app.get('/data/date/:dateURL/', (req, res) =>{
  const urlLookup = req.params.dateURL;
  db.all(
    'SELECT * FROM ' + urlLookup.toString(),
    (err, rows) =>
    {
      if(rows.length > 0) {

        res.send(rows);
      } else {
        res.send({});
      }
    }
  );
});

//gets all data on given site for given day
app.get('/data/date/:dateURL/:url', (req, res) =>{
  let dateLookup = req.params.dateURL;
  let urlToLookup = req.params.url;

  //prevents server from crashing if invalid date is inputted
  if(tableDates.indexOf(dateLookup.toString()) == -1)
        {dateLookup = '[04_21_2018]'; urlToLookup = '';}

  db.all(
    'SELECT * FROM ' + dateLookup.toString() + ' WHERE URL=$URL',
    {
      $URL: urlToLookup
    },
    (err, rows) =>
    {
      if(rows.length > 0) {

        res.send(rows);
      } else {
        res.send({});
      }
    }
  );
});

//gets all data on given site for all days
app.get('/data/all/:url', (req, res) => {
  const urlToLookup = req.params.url; // matches ':url' above

  // db.all() fetches all results from an SQL query into the 'rows' variable:
  db.all(
    'SELECT * FROM allSites WHERE URL=$URL',
    // parameters to SQL query:
    {
      $URL: urlToLookup
    },
    // callback function to run when the query finishes:
    (err, rows) => {
      console.log(rows);
      if (rows.length > 0) {
        res.send(rows);
      } else {
        res.send({}); // failed, so return an empty object instead of undefined
      }
    }
  );
});

//gets all data available
app.get('/data/all', (req, res) =>{
  db.all(
    'SELECT * FROM allSites',
    (err, rows) =>
    {
      if(rows.length > 0) {
        res.send(rows);
      } else {
        res.send({});
      }
    }
  );
});

app.get('/data/events', (req, res) =>
{
  db2.all(
    'SELECT * FROM events',
    (err, rows) =>
    {
      if (rows.length > 0) {
        res.send(rows);
      } else {
        res.send({});
      }
    }
  );
});

app.get('/data/events/:event', (req, res) =>
{
  const eventLookup = req.params.event;
  db2.all(
    'SELECT * FROM events WHERE EVENT=$EVENT',
    {
      $EVENT: eventLookup
    },
    (err, rows) =>
    {
      if (rows.length > 0) {
        res.send(rows);
      } else {
        res.send({});
      }
    }
  );
});

// start the server at URL: http://localhost:3000/
app.listen(3000, () => {
  console.log('Server started at http://localhost:3000/');
});
