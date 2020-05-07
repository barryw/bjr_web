include Pagy::Frontend

module ApplicationHelper
  #
  # Return a datetime in the user's timezone
  #
  def user_tz(datetime)
    datetime.nil? ? '' : datetime.in_time_zone(Time.zone)
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
    val ? '<i class="ion-checkmark"></i>'.html_safe : '<i class="ion-close"></i>'.html_safe
  end

  #
  # Map a job to a css style so that we can highlight it appropriately
  #
  def job_row_color(job)
    return 'table-warning' if job.running
    return 'table-danger' if !job.running and !job.success
    return 'table-success'
  end
end
