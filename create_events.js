const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('events.db');

// run each database statement *serially* one after another
// (if you don't do this, then all statements will run in parallel,
//  which we don't want)
db.serialize(() => {
  // create a new database table:
  // db.run("CREATE TABLE events (event STRING, frequency STRING, timeStart STRING, timeEnd STRING)");

  // insert 3 rows of data:
  db.run("INSERT INTO events VALUES ('Homework', 'daily', '11:00:00 AM', '2:00:00 PM')");
  db.run("INSERT INTO events VALUES ('Silly Cat Videos', 'once', '4/25/2018 5:00:00 PM', '4/25/2018 6:00:00 PM')");

  console.log('successfully created the event table in events.db');

  // print them out to confirm their contents:
  db.each("SELECT event, frequency, timeStart FROM events", (err, row) => {
      console.log(row.event + ": " + row.frequency + ' - ' + row.timeStart);
  });
});

db.close();
