
$(document).ready(() => {
      $('#dayButton').click(); //should add to its own js
});

$(document).ajaxError(() => {
  $('#status').html('Error: unknown ajaxError!');
});
