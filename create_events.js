/*
Creates events in web_data.db
*/


const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('web_data.db');

// run each database statement *serially* one after another
// (if you don't do this, then all statements will run in parallel,
//  which we don't want)
// insert 3 rows of data:

db.serialize(() => {
  // create a new database table:
  // db.run("CREATE TABLE events (event STRING, frequency STRING, timeStart STRING, timeEnd STRING)");
  // db.run("INSERT INTO [04_23_2018] VALUES (300,'Event', '4/23/2018 11:00:00 AM', '4/23/2018 2:00:00 PM', 'Homework')");
  // db.run("INSERT INTO [04_21_2018] VALUES (299,'Event', '4/21/2018 11:00:00 AM', '4/21/2018 2:00:00 PM', 'Homework')");

   //db.run("DELETE FROM [04_22_2018] WHERE URL='Event';");
  //db.run("INSERT INTO [04_22_2018] VALUES (301,'Event', '4/22/2018 4:00:00 PM', '4/22/2018 6:00:00 PM', 'Silly Cat Videos')");
  console.log('successfully created the event table in events.db');
  // print them out to confirm their contents:
  // db.each("SELECT * FROM events", (err, row) => {
  //     console.log(row.ID + ": " + row. + ' - ' + row.timeStart);
  // });
});

db.close();
