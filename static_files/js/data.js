/*
  This file makes charts from data given in the other .js files (ex. home.js, search,js)
  The make functions manipulate the data so that it works with the chart.js or Google Charts API.
  The other functions peform specific tasks
*/

//makes a piechart with data given
function makePieChart(topSitesData)
{
  var URLs = [];
  var durations = [];
  for(const x of topSitesData)
  {
    URLs.push(x.URL);
    durations.push(convertTime(x.duration, 0));
  }
  console.log(URLs, durations);
  //pie
  var ctxP = document.getElementById("pieChart").getContext('2d');
  var myPieChart = new Chart(ctxP, {
  type: 'pie',
  data: {
  labels: URLs,
  datasets: [
  {
  data: durations,
  backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "blue"],
  hoverBackgroundColor: ["#FF5A5E", "#5AD3D1", "#FFC870", "#A8B3C5","orange"]
  }
  ]
  },
  options: {
      responsive: true,
      events:[]
  }
  });
};

//creates timeline with data arguments[1] makes a timeline with all sites and argument [2] makes a timeline with only the specified sites arguments[3] makes a timeline with events
function makeTimeline(data, allSites, specificSites)
{
  google.charts.load('current', {'packages':['timeline']});
  google.charts.setOnLoadCallback(drawChart);
  function drawChart() {
      var container = $('.graph')[0];
      var chart = new google.visualization.Timeline(container);
      var dataTable = new google.visualization.DataTable();

      dataTable.addColumn({ type: 'string', id: 'URL' });
      dataTable.addColumn({ type: 'string', id: 'Event' });
      dataTable.addColumn({ type: 'date', id: 'Start' });
      dataTable.addColumn({ type: 'date', id: 'End' });

      var rowData;

          for (const x of data)
          {
            if(x.URL == 'Event')
            {
              rowData = ['Events', x.duration, new Date(x.timeStart), new Date(x.timeEnd)];
              dataTable.addRow(rowData);
            }
            else if(x.URL != 'URL')
            {
              //adds all data for given date to timeline
              if(allSites)
              {
                rowData = [x.URL, '', new Date(x.timeStart), new Date(x.timeEnd)];
                dataTable.addRow(rowData);
              }
              else
              {
                //only add to row if site is in the top # of sites
                for (const y of specificSites)
                {
                  if(x.URL == y.URL)
                  {
                    rowData = [x.URL, '', new Date(x.timeStart), new Date(x.timeEnd)];
                    dataTable.addRow(rowData);
                  }
                }
              }
            }
          }

        // else
        // {
        //   $.ajax({
        //   url: calEvent,
        //   type: 'GET',
        //   dataType: 'json',
        //   async: false,
        //   success: (calEvents) => {
        //     console.log(calEvents);
        //     var startTime = calEvents[0].timeStart;
        //     var endTime = calEvents[0].timeEnd;
        //
        //     for(var i = 1; i < data.length; i++)
        //     {
        //       // console.log('data start: ' + data[i].timeStart + '\n data end: ' + data[i].timeEnd);
        //
        //       if(withinEvent(data[i].timeEnd, startTime) >= 0 && withinEvent(data[i].timeStart, endTime) <= 0)
        //       {
        //           if(allSites)
        //           {
        //             rowData = [data[i].URL, '', new Date(data[i].timeStart), new Date(data[i].timeEnd)];
        //             dataTable.addRow(rowData);
        //           }
        //           else
        //           {
        //             //only add to row if site is in top
        //             for (const y of specificSites)
        //             {
        //               if(data[i].URL == y.URL)
        //               {
        //                 rowData = [data[i].URL, '', new Date(data[i].timeStart), new Date(data[i].timeEnd)];
        //                 dataTable.addRow(rowData);
        //               }
        //             }
        //           }
        //       }
        //       else if (withinEvent(data[i].timeStart, endTime) < 0)//terminate for loop if end time is reached
        //       {
        //         i = data.length;
        //       }
        //     }
        //       rowData = eventConversion(calEvents[0], data[1].timeStart);
        //       dataTable.addRow(rowData);
        //   }
        //   });
        // }
      var options = {
          allowHTML: true,
          timeline: { colorByRowLabel: true },
          'width':  '100%',
          'height': '100%',
      };

      chart.draw(dataTable);
  }


};

//makes the chart for the day arguments[1] has event data
function makeDayChart(data)
{
    mainTitle = nameTitle(data[0].URL);
    google.charts.load('current', {'packages':['corechart', 'bar']});
       google.charts.setOnLoadCallback(drawChart);

       function drawChart() {

         var dataTable = new google.visualization.DataTable();
         dataTable.addColumn('string', 'Time of Day');
         dataTable.addColumn('number', 'Duration');
         dataTable.addColumn({type: 'string', role: 'tooltip'});

         var rowData;
         var morning = 0;
         var afternoon = 0;
         var evening = 0;
         for (const x of data)
         {
           if(x.URL != 'URL' && x.URL != 'Event')
           {
             console.log(x.duration);
             var duration = convertTime(x.duration, 1);
             var date = new Date(x.timeStart);
             var timeOfDay = findTimeOfDay(date);
             switch (timeOfDay)
             {
               case 0: morning += duration;
               // console.log(morning);
               break;
               case 1: afternoon += duration;
               // console.log(afternoon);
               break;
               case 2: evening += duration;
               // console.log(evening);
               break;
               default: console.log('error');
             }
           }
         }
         morning = Math.floor((morning + 30) / 60);
         afternoon = Math.floor((afternoon + 30) / 60);
         evening = Math.floor((evening + 30) / 60);
         // console.log(evening);
         dataTable.addRows([
           ['Morning', morning, 'Morning\n Duration: ' + morning + ' minutes'],
           ['Afternoon', afternoon, 'Afternoon\n Duration: ' + afternoon + ' minutes'],
           ['Evening', evening, 'Evening\n Duration: ' + evening + ' minutes']
         ]);

         var options = {
           title: mainTitle,
           height: 450,
           bar: {groupWidth: '100%'}
         };

        var chart = new google.visualization.ColumnChart(document.getElementById('timeline'));

         chart.draw(dataTable, google.charts.Bar.convertOptions(options));
       }
};

//makes the chart for the week argument[1] has events
function makeWeekChart(data)
{
    mainTitle = nameTitle(data[0].URL);
    google.charts.load('current', {'packages':['corechart', 'bar']});
       google.charts.setOnLoadCallback(drawChart);

       function drawChart() {

         var dataTable = new google.visualization.DataTable();
         dataTable.addColumn('string', 'Day of Week');
         dataTable.addColumn('number', 'Duration');
         dataTable.addColumn({type: 'string', role: 'tooltip'});

         var rowData;
         var week = [0,0,0,0,0,0,0];
         for (const x of data)
         {
           if(x.URL != 'URL' && x.URL != 'Event')
           {
             var duration = convertTime(x.duration, 1);
             var date = new Date(x.timeStart);
             var timeOfDay = findDayOfWeek(date);
             week[timeOfDay] += duration;
           }
           else {
             console.log(x.URL);
           }
         }

        //converts time data for each day of the week into minutes
        for (let i = 0; i < week.length; i++)
        {
          week[i] = Math.floor((week[i] + 30) / 60);
        }

        //Adds each day in the order listed below
         dataTable.addRows([
           ['Sunday', week[0], 'Sunday\n Duration: ' + week[0] + ' minutes'],
           ['Monday', week[1], 'Monday\n Duration: ' + week[1] + ' minutes'],
           ['Tuesday', week[2], 'Tuesday\n Duration: ' + week[2] + ' minutes'],
           ['Wednesday', week[3], 'Wednesday\n Duration: ' + week[3] + ' minutes'],
           ['Thursday', week[4], 'Thursday\n Duration: ' + week[4] + ' minutes'],
           ['Friday', week[5], 'Friday\n Duration: ' + week[5] + ' minutes'],
           ['Saturday', week[6], 'Saturday\n Duration: ' + week[6] + ' minutes']
         ]);

         var options = {
           title: mainTitle,
           height: 450,
           bar: {groupWidth: '100%'}
         };

        var chart = new google.visualization.ColumnChart(document.getElementById('timeline'));

         chart.draw(dataTable, google.charts.Bar.convertOptions(options));

     };
};

//caculates total duration of given data (all sites or specific sites given)
function totalDuration(rows)
{
  const timeArray = [0,0,0];
  if(rows[0].URL == 'URL')
    {rows[0].duration = '0:00:00';}

  //Place entire duration of website throughout given period
  for(let i = 0; i < rows.length; i++)
  {
    let first = rows[i].duration;
    first = first.split(':');
    timeArray[2] += parseInt(first[2])
    timeArray[1] += parseInt(first[1])
    timeArray[0] += parseInt(first[0])
  }

  //Converts time into hh:mm:ss format
  timeArray[1] += Math.floor(timeArray[2] / 60);
  timeArray[0] += Math.floor(timeArray[1] / 60);
  timeArray[1] = timeArray[1] % 60;
  timeArray[2] = timeArray[2] % 60;

  //Adds leading zero if needed
  for(let i = 0; i < timeArray.length; i++)
  {
    if(timeArray[i].toString().length == 1)
    {
      timeArray[i] = '0' + timeArray[i].toString();
    }
  }
  const y = timeArray.reduce((acc, cur) => acc + ':' + cur);
  return y;

};

//recieves date and changes it to database table format
function formatDate(date)
{
  validDates =
  [
    '2018-04-21','2018-04-22','2018-04-23',
    '2018-04-24','2018-04-25','2018-04-26','2018-04-27'
  ]

  dateReplace =
  [
    '[04_21_2018]','[04_22_2018]','[04_23_2018]',
    '[04_24_2018]','[04_25_2018]','[04_26_2018]','[04_27_2018]'
  ]
  let dateMatched = false;
  let i = 0;
  while(!dateMatched && i < validDates.length)
  {
    if(date == validDates[i])
    {
      date = dateReplace[i];
      dateMatched = true;
    }
    i++;
  }
  //if matching date cannot be found use 04/21
  if(!dateMatched)
  {
    date = '[04_21_2018]'
  }
  return date;
};

//  sorts duration of two websites
function sortByTime(a, b) {
  let regex = 'Time: ([0-9]*):([0-9]*):([0-9]*)';
  let aTime = $(a).text().match(regex);
  aTime = parseInt(aTime[1] + aTime[2] + aTime[3]);
  let bTime = $(b).text().match(regex)
  bTime = parseInt(bTime[1] + bTime[2] + bTime[3]);
  return bTime - aTime;
};

// sorts URLs of two websites
function sortByName(a, b) {
  a = $(a).text().split(' ')[0];
  b = $(b).text().split(' ')[0];

  return a.localeCompare(b);
};

//timeUnit 0 = minutes, 1 = seconds
function convertTime(duration, timeUnit)
{
  const regex = '([0-9]*):([0-9]*):([0-9]*)';
  duration = duration.match(regex);
  let hours = parseInt(duration[1]);
  let minutes = parseInt(duration[2]);
  let seconds = parseInt(duration[3]);

  if(timeUnit == 0)
  {
    minutes += (hours * 60);
    if(seconds >= 30)
      minutes++;
    duration = minutes;
  }
  else if(timeUnit == 1)
  {
    minutes += (hours * 60);
    seconds += (minutes * 60);
    duration = seconds;
  }
  return duration;
};

//timeOfDay 0 = morning, 1 = afternoon, 2 = evening
function findTimeOfDay(date)
{
  let timeOfDay;

  if(date.getHours() < 12)
    timeOfDay = 0;
  else if (date.getHours() < 16)
    timeOfDay = 1;
  else
    timeOfDay = 2;

  // console.log(timeOfDay)
  return timeOfDay;
};

//dayOfWeek 0 = Sunday, 1 = Monday ... 6 = Saturday
function findDayOfWeek(date)
{
  return date.getDay();
};

//Changes title of URL to All Sites when All sites are calculated
function nameTitle(name)
{
  if (name == 'URL')
  {
    name = 'All Sites';
  }
  return name;
}
