const express = require('express');
const app = express();

//using this library to interface with SQLite db https://github.com/mapbox/node-sqlite3
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('web_data.db')

app.use(express.static('static_files'));

/*depracated database
const fakeDatabase = {
  'john': {socialMedia: 300, onlineTV: 100, education: 40, other: 120},
  'jenny': {socialMedia: 200, onlineTV: 200, education: 20, other: 140},
  //'Chocolate': {job: 'student',   pet: 'dog.jpg'},
  //'Carol': {job: 'engineer',  pet: 'bear.jpg'}
};
*/

// DEPRACATED - need to add a second database to be associated with
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


// Modified to GET data associated with a specific date
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

// start the server at URL: http://localhost:3000/
app.listen(3000, () => {
  console.log('Server started at http://localhost:3000/');
});
