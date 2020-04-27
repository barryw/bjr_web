include Pagy::Frontend

module ApplicationHelper
  def user_tz(datetime)
    datetime.nil? ? '' : datetime.in_time_zone(Time.zone)
  end
end
