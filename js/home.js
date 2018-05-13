let allWebTime = {URL: '', duration:[]};
let totalTime = 0;
let chartType;
    $(document).ready(() => {
      $('#allSitesButton').click( () =>{
        $('#dateButton').click();
      })
        $('#readButton').click(() => {
            const requestURL = 'data/all/' + $('#nameBox').val();
            console.log('making ajax request to:', requestURL);

            // From: http://learn.jquery.com/ajax/jquery-ajax-methods/
            $.ajax({
                // all URLs are relative to http://localhost:3000/
                url: requestURL,
                type: 'GET',
                dataType: 'json',
                success: (data) => {
                    console.log('You received some data!', data);
                    if(data.length > 0)
                    {
                        $('#status').html('Successfully fetched data at URL: ' + requestURL);
                        $('#timeStart').html('Website: ' + data[0].URL);
                        // $('#timeEnd').html('Time End: ' + data.timeEnd);
                        totalTime = totalDuration(data);
                        $('#duration').html('Duration: ' + totalTime);
                        makeDayChart(data);
                    }
                    else {
                      $('#timeStart').html('Could not find website');
                      $('#duration').html('');
                    }
                },
            });
        });

        $('#dateButton').click( () => {
            let urlName = 'data/date/' + formatDate($('#dateBox').val());
            $.ajax({
                url: urlName,
                type: 'GET',
                dataType: 'json',
                success: (data) => {
                  makeTimeline(data);
                    console.log('got website data');
                    $('#timeStart').html('<ul></ul>');
                    const websiteList = ['URL'];
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
                           let urlName = 'data/date/' + formatDate($('#dateBox').val()) + '/' + x.URL;
                          $.ajax({
                              // all URLs are relative to http://localhost:3000/
                              url: urlName,
                              type: 'GET',
                              dataType: 'json',
                              success: (data) => {
                              allWebTime.duration.push(totalDuration(data));
                              $('#timeStart').append('<li>' +  x.URL + '<br> &emsp;&emsp; Time: ' + allWebTime.duration[allWebTime.duration.length - 1] + '</li>');
                              $('#timeStart').children('li').sort(sortByTime).appendTo('#timeStart');
                              },
                          });
                        }

                      }
                      //console.log(allWebTime.duration.reduce((acc, cur) => acc + cur));
                              // console.log(totalDuration(allWebTime));
                              // $('#duration').html('Total Duration ' + totalDuration(allWebTime));

                },
            });
        });

        $('#sortTimeButton').click( () => {

          $('#timeStart').children('li').sort(sortByTime).appendTo('#timeStart');
        });
        $('#sortNameButton').click( () => {

          $('#timeStart').children('li').sort(sortByName).appendTo('#timeStart');
        });
        // http://api.jquery.com/ajaxerror/
        $(document).ajaxError(() => {
            $('#status').html('Error: unknown ajaxError!');
        });
    });
