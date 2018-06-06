/*
  This file makes ajax calls to the backend in the form of two main
  functionalities: adding an element to our database and deleting
  an element from our database.

  The adding element functionality centers around a POST that goes
  to the specified table by date and inputs the user inputted 
  event information.

  The deleting element functionality uses DELETE to go to the
  user inputted date and takes note of the relevant input needed
  to find the correctt event to delete in the database.
*/
$(document).ready(() => {
  $('#addButton').click(() => {
    $.ajax({
      // all URLs are relative to http://localhost:3000/
      url: '../data/date/' + formatDate($('#addFromDate').val()),
      type: 'POST',
      data: {
              ID: 600,
              URL: 'Event',
              //NOTE: need to fix formatting to match others, still enters data base fine
              timeStart: $('#addFromDate').val() + ' ' + $('#addFromTime').val(),
              timeEnd: $('#addToDate').val() + ' ' + $('#addToTime').val(),
              duration: $('#addEventName').val()
            },
      success: (data) => {
        $('#status').html(data.message);
      }
    });
  });

  /* Note: comment out "data" section and uncomment the comment in line 33 for version that only deletes by eventname */
  $('#deleteButton').click(() => {
    $.ajax({
      // all URLs are relative to http://localhost:3000/
      url: '../data/date/' + formatDate($('#deleteFromDate').val()) /*+ '/' + $('#deleteEventName').val()*/ ,
      type: 'DELETE',
      data: {
        ID: 600,
        URL: 'Event',
        //NOTE: need to fix formatting to match others, still enters data base fine
        timeStart: $('#deleteFromDate').val() + ' ' + $('#deleteFromTime').val(),
        timeEnd: $('#deleteToDate').val() + ' ' + $('#deleteToTime').val(),
        duration: $('#deleteEventName').val()
      },
      success: (data) => {
        $('#status').html(data.message);
        console.log('hi, it worked maybe');
      }
    });
  });

  /*$('#deleteButton').click(() => {
    $.ajax({
      // all URLs are relative to http://localhost:3000/
      url: '../data/date/' + formatDate($('#deleteFromDate').val()),
      type: 'DELETE',
      data: {
              ID: 600,
              URL: 'Event',
              //NOTE: need to fix formatting to match others, still enters data base fine
              timeStart: $('#deleteFromDate').val() + ' ' + $('#deleteFromTime').val(),
              timeEnd: $('#deleteToDate').val() + ' ' + $('#deleteToTime').val(),
              duration: $('#deleteEventName').val()
            },
      success: (data) => {
        $('#status').html(data.message);
        console.log('hi, it worked maybe');
      }
    });
  });*/
});



$(document).ajaxError(() => {
  $('#status').html('Error: unknown ajaxError!');
});
