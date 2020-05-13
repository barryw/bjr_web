include Pagy::Frontend

module ApplicationHelper
  #
  # Return a datetime in the user's timezone
  #
  def user_tz(datetime)
    datetime.blank? ? '' : datetime.in_time_zone(Time.zone).strftime('%Y-%m-%d %H:%M:%S %z')
  end

  #
  # Return the BJR server version
  #
  def server_version
    api = ApiClient.new
    api.server_version.object
  end

  def web_version
    $version
  end

  #
  # Return an icon from ionicons for boolean value
  #
  def bool_icon(val)
    val ? '<i class="icon-check"></i>'.html_safe : '<i class="icon-close"></i>'.html_safe
  end

  #
  # Map a job to a css style so that we can highlight it appropriately
  #
  def job_row_color(job)
    return 'table-warning' if job.running
    return 'table-danger' if !job.running and !job.success
    return 'table-success'
  end

  #
  # Convert the job objects coming from the API into something the UI can handle
  #
  def jobs_to_uijobs(jobs)
    ui_jobs = []
    jobs.object.each do |job|
      ui_jobs << { id: job.id, name: job.name, cron: job.cron, command: job.command, timezone: job.timezone,
                   success: bool_icon(job.success), enabled: bool_icon(job.enabled), running: bool_icon(job.running),
                   last_run: user_tz(job.last_run), next_run: user_tz(job.next_run), created_at: user_tz(job.created_at),
                   updated_at: user_tz(job.updated_at), success_callback: job.success_callback, failure_callback: job.failure_callback,
                   tags: job.tags }
    end

    ui_jobs
  end
end
