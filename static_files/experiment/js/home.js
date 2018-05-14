// let allWebTime = {URL: '', duration: '', seconds: 0};
let allData = [];
let totalTime = 0;
let chartType;
let lastFive;
let getData;
let allSitesClicked = false;
let isDateDirect = false;
    $(document).ready(() => {
      $('#allSitesButton').click( () =>{
        //allSitesClicked = !allSitesClicked;
        isDateDirect = false;
        $('#dateButton').click();

      })
        $('#dayButton').click(() =>
        {
            displaySiteGraph(false);
        });

        $('#weekButton').click(() =>
      {
            displaySiteGraph(true);
      });
        $('#readButton').click(() => {
          displaySiteGraph(false);
        });

        $('#dateButton').click( () => {
          easyFix(true);
          setTimeout(easyFix, 300);
        });

        $('#sortTimeButton').click( () => {
          $('#timeStart').children('li').sort(sortByTime).appendTo('#timeStart');
          allData.sort((a,b) => b.seconds - a.seconds);
          showOrHideSites();
        });
        $('#sortNameButton').click( () => {

          $('#timeStart').children('li').sort(sortByName).appendTo('#timeStart');
        });
        // http://api.jquery.com/ajaxerror/
        $(document).ajaxError(() => {
            $('#status').html('Error: unknown ajaxError!');
        });
        $('#allSitesButton').click();
    });

function showOrHideSites()
{
  if(!allSitesClicked)
  {
    lis = $('#timeStart').children('li');
    for(let i=5; i < lis.length; i++) {
      lis[i].remove();
    }
    $('#allSitesButton').html('View All Sites');
    $('#showSitesHeader').html('<h1>Top 5 Sites</h1>');
  }
  else
  {
      $('#allSitesButton').html('View Top 5');
      $('#showSitesHeader').html('<h1>All Sites</h1>');
  }

}

//Have to run twice to show top 5 for some reason
function easyFix()
{
  let dateGiven = $('#dateBox').val();
  let urlName = '../data/date/' + formatDate(dateGiven);
  dateGiven = dateGiven.split('-');
  dateGiven = dateGiven[1] + '\/' + dateGiven[2] + '\/' + dateGiven[0];
      $('#dailyTimeline').html('<h1>Daily Timeline - ' + dateGiven + '</h1>');
  const displayGraph = arguments[0];
  $.ajax({
      url: urlName,
      type: 'GET',
      dataType: 'json',
      success: (data) => {
        console.log(displayGraph);
        if(!displayGraph)
          makeTimeline(data, allSitesClicked, allData.slice(0,5));

          console.log('got website data');
          $('#timeStart').html('<ul></ul>');
          const websiteList = ['URL'];
          allData = [];
          for(const x of data)
          {
            let URLtoList = false;

            for(const y of websiteList)
            {
              if(x.URL === y)
              {
                URLtoList = true;
              }
              }
              if(!URLtoList)
              {
                websiteList.push(x.URL);
                 let urlName = '../data/date/' + formatDate($('#dateBox').val()) + '/' + x.URL;
                $.ajax({
                    // all URLs are relative to http://localhost:3000/
                    url: urlName,
                    type: 'GET',
                    dataType: 'json',
                    success: (data) => {

                    let currentDuration = totalDuration(data);
                    let allWebTime = {URL: '', duration: '', seconds: 0};
                    allWebTime.URL = x.URL;
                    allWebTime.duration = currentDuration;
                    allWebTime.seconds = convertTime(currentDuration,1);
                    allData.push(allWebTime);

                    $('#timeStart').append('<li>' +  x.URL + '<br> &emsp;&emsp; Time: ' +allData[allData.length - 1].duration + '</li>');
                    $('#sortTimeButton').click();
                    },
                });
              }
            }
      },
  });
  console.log(allData.slice(0,5));
}

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
        console.log(data);
        mainTitle = nameTitle(data[0].URL);
          console.log('You received some data!', data);
          if(data.length > 0)
          {
              $('#status').html('Successfully fetched data at URL: ' + requestURL);
              $('#timeStart').html('Website: ' + mainTitle);
              // $('#timeEnd').html('Time End: ' + data.timeEnd);
              totalTime = totalDuration(data);
              $('#duration').html('Duration: ' + totalTime);
              frequency ? makeWeekChart(data) : makeDayChart(data);
          }
          else {
            $('#timeStart').html('Could not find website');
            $('#duration').html('');
          }
      },
  });
}
