module HomeHelper

  def stats_labels(stats)
    labels = []
    stats.each do |stat|
      labels << stat.start_dt.in_time_zone(Time.zone).strftime('%H:%M')
    end

    labels
  end

  def run_datasets(stats)
    datasets = { runs: { data: [], label: I18n.t('home.runs_charts.runs'),
                        backgroundColor: "transparent", borderColor: '#7571F9', borderWidth: 0.5, pointStyle: 'circle',
                        pointRadius: 5, pointBorderColor: 'transparent', pointBackgroundColor: '#7571F9', pointHoverRadius: 6
                       },
                 failed: { data: [], label: I18n.t('home.runs_charts.failed'),
                        backgroundColor: "transparent", borderColor: '#4d7cff', borderWidth: 0.5, pointStyle: 'circle',
                        pointRadius: 5, pointBorderColor: 'transparent', pointBackgroundColor: '#4d7cff', pointHoverRadius: 6
                         },
                 job_count: { data: [], label: I18n.t('home.runs_charts.job_count'),
                        backgroundColor: "transparent", borderColor: '#173e43', borderWidth: 0.5, pointStyle: 'circle',
                        pointRadius: 5, pointBorderColor: 'transparent', pointBackgroundColor: '#173e43', pointHoverRadius: 6
                            }
               }
    stats.each do |stat|
      datasets[:runs][:data] << stat.runs
      datasets[:failed][:data] << stat.failed
      datasets[:job_count][:data] << stat.job_count
    end

    [ datasets[:runs], datasets[:failed], datasets[:job_count] ]
  end

  def runtime_datasets(stats)
    datasets = { avg: { data: [], label: I18n.t('home.runtime_charts.avg_runtime'),
                        backgroundColor: "transparent", borderColor: '#7571F9', borderWidth: 0.5, pointStyle: 'circle',
                        pointRadius: 5, pointBorderColor: 'transparent', pointBackgroundColor: '#7571F9', pointHoverRadius: 6
                      },
                 min: { data: [], label: I18n.t('home.runtime_charts.min_runtime'),
                        backgroundColor: "transparent", borderColor: '#4d7cff', borderWidth: 0.5, pointStyle: 'circle',
                        pointRadius: 5, pointBorderColor: 'transparent', pointBackgroundColor: '#4d7cff', pointHoverRadius: 6
                      },
                 max: { data: [], label: I18n.t('home.runtime_charts.max_runtime'),
                        backgroundColor: "transparent", borderColor: '#173e43', borderWidth: 0.5, pointStyle: 'circle',
                        pointRadius: 5, pointBorderColor: 'transparent', pointBackgroundColor: '#173e43', pointHoverRadius: 6
                      }
               }

    stats.each do |stat|
      datasets[:avg][:data] << stat.avg_runtime
      datasets[:min][:data] << stat.min_runtime
      datasets[:max][:data] << stat.max_runtime
    end

    [ datasets[:avg], datasets[:min], datasets[:max] ]
  end

  def chart_options(title, xlabel, ylabel)
    {
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
              fontSize: 12,
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
                  labelString: xlabel
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
                  labelString: ylabel
              }
          }]
      },
      title: {
          display: true,
          text: title,
          fontSize: 18,
      }
  }
  end
end
