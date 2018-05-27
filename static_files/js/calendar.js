

$(document).ready(() => {
  $.ajax({
      // all URLs are relative to http://localhost:3000/
      url: '/data/events',
      type: 'GET',
      dataType: 'json',
      success: (data) => {
        for (const x of data)
        {
          $('#eventList').append('<button class="eventButton"  type="button" value="' + x.event +  '">' + x.event + '</button>');
        }

        $('.eventButton').click((event) => {
          let buttonClicked = event.target.value;
          events = ['/data/events/' + buttonClicked];
          $('#top5Button').click();
        });
        $('#eventList').append('<button id="noEventsButton"  type="button" value="No Events">No Events</button>');
        $('#noEventsButton').click( () =>
        {
          events = [];
          $('#allSitesButton').click();
        });
      },
  });

});



$(document).ajaxError(() => {
  $('#status').html('Error: unknown ajaxError!');
});
