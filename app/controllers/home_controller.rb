class HomeController < ApplicationController
  def new
    @team_data = {
      labels: ["2010", "2011", "2012", "2013", "2014", "2015", "2016"],
      defaultFontFamily: 'Montserrat',
      datasets: [{
          data: [0, 15, 7, 12, 85, 10, 50],
          label: "Jobs Executed",
          backgroundColor: '#4d7cff',
          borderColor: '#4d7cff',
          borderWidth: 0.5,
          pointStyle: 'circle',
          pointRadius: 5,
          pointBorderColor: 'transparent',
          pointBackgroundColor: '#4d7cff',
      }, {
          label: "Jobs Failed",
          data: [0, 30, 5, 3, 15, 5, 0],
          backgroundColor: '#7571F9',
          borderColor: '#7571F9',
          borderWidth: 0.5,
          pointStyle: 'circle',
          pointRadius: 5,
          pointBorderColor: 'transparent',
          pointBackgroundColor: '#7571F9',
      }]
    }

    @team_options = {
        responsive: true,
        tooltips: {
            mode: 'index',
            titleFontSize: 12,
            titleFontColor: '#000',
            bodyFontColor: '#000',
            backgroundColor: '#fff',
            titleFontFamily: 'Montserrat',
            bodyFontFamily: 'Montserrat',
            cornerRadius: 3,
            intersect: false,
        },
        legend: {
            position: 'top',
            labels: {
                usePointStyle: true,
                fontFamily: 'Montserrat',
            },


        },
        scales: {
            xAxes: [{
                display: true,
                gridLines: {
                    display: false,
                    drawBorder: false
                },
                scaleLabel: {
                    display: false,
                    labelString: 'Month'
                }
            }],
            yAxes: [{
                display: true,
                gridLines: {
                    display: false,
                    drawBorder: false
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Value'
                }
            }]
        },
        width: 500,
        height: 150,
        title: {
            display: false,
        }
    }
  end
end
