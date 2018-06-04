/*
  This is where we'll add the add and delete
  events funtionality
  The event objects will be placed into a date table [MM_DD_YYYY]
  with the following format (ID(number),'Event', '4/23/2018 11:00:00 AM'(startTime), '4/23/2018 2:00:00 PM'(endTime), 'EventName'(eventString))
  the second variable ('Event') is the same for all events. EventName is where we name the events
  example: (300,'Event', '4/23/2018 11:00:00 AM', '4/23/2018 2:00:00 PM', 'Homework')
*/
$(document).ready(() => {

});



$(document).ajaxError(() => {
  $('#status').html('Error: unknown ajaxError!');
});
