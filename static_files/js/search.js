/*
  This file makes an ajax call to the database
  for all data or a specific site depending on
  what the user types. Once the call is made, the
  data is sent to makeDayChart() or makeWeekChart()
  in data.js depending on what view the user is in.
*/
$(document).ready(() => {

  $('#readButton').click(() => {
      displaySiteGraph(false);
  });

  $('#dayButton').click(() =>
  {
      displaySiteGraph(false);
      isWeek = false;
  });

  $('#weekButton').click(() =>
   {
       displaySiteGraph(true);
       isWeek = true;
   });

  $('#submitButton').click(() =>{
      displaySiteGraph(isWeek);
    })

    $('#dayButton').click();

});

//displays bar graph for site frequency: false = day, true = week
function displaySiteGraph(frequency)
{
    const requestURL = '../data/all/' + $('#nameBox').val();
    console.log('making ajax request to:', requestURL);
    // From: http://learn.jquery.com/ajax/jquery-ajax-methods/
    $.ajax({
        // all URLs are relative to http://localhost:3000/
        url: requestURL,
        type: 'GET',
        dataType: 'json',
        success: (data) => {
            // console.log(data);
            mainTitle = nameTitle(data[0].URL);
            console.log('You received some data!', data);
            if(data.length > 0)
            {
                $('#status').html('Successfully fetched data at URL: ' + requestURL);
                $('#timeStart').html('Website: ' + mainTitle);
                // $('#timeEnd').html('Time End: ' + data.timeEnd);
                totalTime = totalDuration(data);
                $('#duration').html('Total Time: ' + totalTime);
                frequency ? makeWeekChart(data) : makeDayChart(data);
            }
            else {
                $('#timeStart').html('Could not find website');
                $('#duration').html('');
            }
        },
    });

}

$(document).ajaxError(() => {
  $('#status').html('Error: unknown ajaxError!');
});
