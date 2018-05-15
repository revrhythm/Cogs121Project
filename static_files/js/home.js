// let allWebTime = {URL: '', duration: '', seconds: 0};
let allData = [];
let totalTime = 0;
let chartType;
let lastFive;
let getData;
let allSitesClicked = false;
let activeNav = 0;
let isDateDirect = false;
let isWeek = false;

$(document).ready(() => {

  $('#sortTimeButton').click( () => {
    console.log('hello');
    $('#timeStart').children('li').sort(sortByTime).appendTo('#timeStart');
    allData.sort((a,b) => b.seconds - a.seconds);
    showOrHideSites();
  });
  $('#sortNameButton').click( () => {

    $('#timeStart').children('li').sort(sortByName).appendTo('#timeStart');
  });

    $('#allSitesButton').click( () =>{
        allSitesClicked = true;
        activeNav = 0;
        easyFix(false);
      });
    $('#allSitesButton').click();
    $('#dayButton').click(() =>
    {
        displaySiteGraph(false);
        isWeek = false;
    });
    $('#dayButton').click();

    $('#weekButton').click(() =>
     {
         displaySiteGraph(true);
         isWeek = true;
     });

    $('#submitButton').click(() =>{
        displaySiteGraph(isWeek);
      })
        $('#dayButton').click(() =>
        {
            displaySiteGraph(false);
        });
        $('#dayButton').click();

        $('#weekButton').click(() =>
      {
            displaySiteGraph(true);
      });

        $('#top5Button').click(() =>
      {
        allSitesClicked = false;
        activeNav = 5;
        easyFix(true);
        setTimeout(easyFix,300);
        //setTimeout(easyFix, 300);
      });

      $('#top10Button').click(() =>
    {
      allSitesClicked = false;
      activeNav = 10;
      easyFix(true);
      // easyFix(false, 10);
      setTimeout(easyFix, 300);
    });
        $('#dateButton').click( () => {
          switch (activeNav)
          {
            case 0: $('#allSitesButton').click();
            break;
            case 5: $('#top5Button').click();
            break;
            case 10: $('#top10Button').click();
            break;
            default: console.log('error in dateButton.click()');
          }
        });

    });

    $('#readButton').click(() => {
        displaySiteGraph(false);
    });


    // http://api.jquery.com/ajaxerror/
    $('#allSitesButton').click();

function showOrHideSites()
{
    console.log('run');
    if (activeNav == 0)
    {
      $('#showSitesHeader').html('<h1>All Sites</h1>');
    }
    else if (activeNav == 5)
    {
      lis = $('#timeStart').children('li');
      for(let i=5; i < lis.length; i++) {
        lis[i].remove();
      }
      $('#showSitesHeader').html('<h1>Top 5 Sites</h1>');
    }
    else
    {
      lis = $('#timeStart').children('li');
      for(let i=10; i < lis.length; i++) {
        lis[i].remove();
      }
      $('#showSitesHeader').html('<h1>Top 10 Sites</h1>');
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
  const numOfSites = activeNav;
  console.log(numOfSites);
  $.ajax({
      url: urlName,
      type: 'GET',
      dataType: 'json',
      success: (data) => {
        console.log(displayGraph);
        if(!displayGraph)
          makeTimeline(data, allSitesClicked, allData.slice(0,numOfSites));

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

$(document).ajaxError(() => {
  $('#status').html('Error: unknown ajaxError!');
});
