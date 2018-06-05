/*
  This is where we'll add the add and delete
  events funtionality
  The event objects will be placed into a date table [MM_DD_YYYY]
  with the following format (ID(number),'Event', '4/23/2018 11:00:00 AM'(startTime), '4/23/2018 2:00:00 PM'(endTime), 'EventName'(eventString))
  the second variable ('Event') is the same for all events. EventName is where we name the events
  example: (300,'Event', '4/23/2018 11:00:00 AM', '4/23/2018 2:00:00 PM', 'Homework')
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

  $('#deleteButton').click(() => {
    $.ajax({
      // all URLs are relative to http://localhost:3000/
      url: '../data/date/' + formatDate($('#deleteFromDate').val()) + '/' + $('#deleteEventName').val() ,
      type: 'DELETE',
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
