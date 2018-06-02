/*
  This file makes ajax calls to the backend and then sends that data
  to makeTimeline or makePiechart in data.js It also filters the data
  depending on what the user clicks so that a timeline only displays
  the top sites based on the duration of usage for the specified date
*/

let allData = [];
let chartType;
let lastFive;
let allSitesClicked = false;
let activeNav = 0;
let isDateDirect = false;
let isWeek = false;


$(document).ready(() => {
  $('#sortTimeButton').click( () => {
    // console.log('called timeButton');
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


    $('#top5Button').click(() =>
      {

        allSitesClicked = false;
        activeNav = 5;
        easyFix(true);
        setTimeout(easyFix,300);
      });

    $('#top10Button').click(() =>
    {
      allSitesClicked = false;
      activeNav = 10;
      easyFix(true);
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

    $('#top5Button').click(); // runs top5button.click() event
  });



//shows sites based on button clicked (ex. Show All (shows all sites), Show Less (shows top 5))
function showOrHideSites()
{
  // console.log(activeNav);
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

//runs twice for top 5 to get new data
function easyFix()
{
  let dateGiven = $('#dateBox').val();
  let urlName = '../data/date/' + formatDate(dateGiven);
  dateGiven = dateGiven.split('-');
  dateGiven = dateGiven[1] + '\/' + dateGiven[2] + '\/' + dateGiven[0];
      $('#dailyTimeline').html('<h1>Daily Timeline - ' + dateGiven + '</h1>');
  const dontDisplay = arguments[0];
  const numOfSites = activeNav;

  //gets data for date specified in dateBox
  $.ajax({
      url: urlName,
      type: 'GET',
      dataType: 'json',
      success: (data) => {
        //does not display data if arguments[0] is true
        if(!dontDisplay)
        {
          makeTimeline(data, allSitesClicked, allData.slice(0,numOfSites));
          //include pie chart if on homepage
          if(window.location.href.includes('home'))
          {
            makePieChart(allData.slice(0,numOfSites));
          }
        }

          console.log('got website data');
          $('#timeStart').html('<ul></ul>');
          const websiteList = ['URL'];
          allData = [];
          for(const x of data)
            {
                let URLtoList = false;

                //checks to see if website URL has been recorded in websiteList
                for(const y of websiteList)
                {
                    if(x.URL === y)
                    {
                        URLtoList = true;
                    }
                }

                //adds website to allData with URL, duration (for display hh:mm:ss) and duration in seconds (for comparison)
                if(!URLtoList)
                {
                    websiteList.push(x.URL);
                    let urlName = '../data/date/' + formatDate($('#dateBox').val()) + '/' + x.URL;
                    //gets data from backend for a website on a specific date
                    $.ajax({
                        // all URLs are relative to http://localhost:3000/
                        url: urlName,
                        type: 'GET',
                        dataType: 'json',
                        success: (data) => {

                            //makes allWebTime object that is pushed to allData array
                            if(x.URL != 'Event')
                              {
                              let currentDuration = totalDuration(data);
                              let allWebTime = {URL: '', duration: '', seconds: 0};
                              allWebTime.URL = x.URL;
                              allWebTime.duration = currentDuration;
                              allWebTime.seconds = convertTime(currentDuration,1);
                              allData.push(allWebTime);

                              //appends allData info
                              $('#timeStart').append('<li>' +  x.URL + '<br> &emsp;&emsp; Time: ' +allData[allData.length - 1].duration + '</li>');
                              $('#sortTimeButton').click();
                              }
                        },
                    });
                }
            }
        },
    });
}

$(document).ajaxError(() => {
  $('#status').html('Error: unknown ajaxError!');
});
