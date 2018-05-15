function totalDuration(rows)
{
  const timeArray = [0,0,0];
  if(rows[0].URL == 'URL')
    {rows[0].duration = '0:00:00';}
  //Place entire duration of website throughout given day
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

function sortByTime(a, b) {
  regex = 'Time: ([0-9]*):([0-9]*):([0-9]*)';
  aTime = $(a).text().match(regex);
  aTime = parseInt(aTime[1] + aTime[2] + aTime[3]);
  bTime = $(b).text().match(regex)
  bTime = parseInt(bTime[1] + bTime[2] + bTime[3]);
  return bTime - aTime;
};

function sortByName(a, b) {
  a = $(a).text().split(' ')[0];
  b = $(b).text().split(' ')[0];

  return a.localeCompare(b);
};

function makeTimeline(data)
{
  google.charts.load('current', {'packages':['timeline']});
  google.charts.setOnLoadCallback(drawChart);
  const onlyTop = arguments[1];
  const topSites = arguments[2];
  function drawChart() {

      var container = $('.graph')[0];
      var chart = new google.visualization.Timeline(container);
      var dataTable = new google.visualization.DataTable();

      dataTable.addColumn({ type: 'string', id: 'URL' });
      dataTable.addColumn({ type: 'string', id: 'Task' });
      dataTable.addColumn({ type: 'date', id: 'Start' });
      dataTable.addColumn({ type: 'date', id: 'End' });

      var rowData;
      for (const x of data)
      {
        if(x.URL != 'URL')
        {
          if(onlyTop)
          {
            rowData = [x.URL, '', new Date(x.timeStart), new Date(x.timeEnd)];
            dataTable.addRow(rowData);
          }
          else
          {
            for (const y of topSites)
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
      // console.log(data);
      // dataTable.addRow(rowData);
          // [ 'Facebook', '', new Date(0,0,0,12,0,0),  new Date(0,0,0,13,30,0) ],
          // [ 'Facebook', '', new Date(0,0,0,14,0,0),  new Date(0,0,0,15,30,0) ],
          // [ 'Google',  '', new Date(0,0,0,16,45,0),  new Date(0,0,0,17,30,0) ],
          // [ 'Amazon',  '', new Date(0,0,0,13,30,0), new Date(0,0,0,14,0,0) ],
          // [ 'Amazon',  '', new Date(0,0,0,15,30,0), new Date(0,0,0,16,45,0) ],
          // [ 'Triton Ed', '', new Date(0,0,0,17,30,0), new Date(0,0,0,18,0,0) ],
          // [ 'Calendar Tasks', 'Study Time', new Date(0,0,0,12,0,0), new Date(0,0,0,14,0,0)],
          // [ 'Calendar Tasks', 'Cram Time', new Date(0,0,0,16,0,0), new Date(0,0,0,18,0,0)]]);

      var options = {
          allowHTML: true,
          timeline: { colorByRowLabel: true },
          'width':  '100%',
          'height': '100%',
      };

      chart.draw(dataTable);
  }


};

function makeBarChart(data)
{

  google.charts.load('current', {'packages':['corechart', 'bar']});
     google.charts.setOnLoadCallback(drawChart);

     function drawChart() {

       var dataTable = new google.visualization.DataTable();
       dataTable.addColumn('datetime', 'Time of Day');
       dataTable.addColumn('number', 'Duration');
       dataTable.addColumn({type: 'string', role: 'tooltip'});

       var rowData;

       for (const x of data)
       {
         if(x.URL != 'URL')
         {
           var duration = convertTime(x.duration, 0);
           var date = new Date(x.timeStart)
           rowData = [date, duration, 'Date: ' + date +'\nDuration: ' + duration + ' minutes'];
           dataTable.addRow(rowData);
         }

       }

       var options = {
         title: 'Total Emails Received Throughout the Day',
         height: 450,
         bar: {groupWidth: '100%'}
       };

      var chart = new google.visualization.ColumnChart(document.getElementById('timeline'));

       chart.draw(dataTable, google.charts.Bar.convertOptions(options));
     }
};

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
           if(x.URL != 'URL')
           {
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
           if(x.URL != 'URL')
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
        for (let i = 0; i < week.length; i++)
        {
          week[i] = Math.floor((week[i] + 30) / 60);
        }
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
          //  hAxis: {
          //   title: 'Time of Day',
          //   format: 'h:mm',
          //   viewWindow: {
          //     min: [0, 0, 0],
          //     max: [23, 59, 0]
          //   }
          // }
         };

        var chart = new google.visualization.ColumnChart(document.getElementById('timeline'));

         chart.draw(dataTable, google.charts.Bar.convertOptions(options));

     };
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

function findDayOfWeek(date)
{
  return date.getDay();
};

function nameTitle(name)
{
  if (name == 'URL')
  {
    name = 'All Sites';
  }
  return name;
}
