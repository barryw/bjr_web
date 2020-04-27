class JobsController < ApplicationController
  def new
    page = params[:page] || 1

    api = ApiClient.new
    jobs, status_code, headers = api.jobs(session[:token], page)

    total = headers['Total'].to_i

    @pagy = Pagy.new(count: total, page: page)
    @jobs = jobs.object
  #rescue
  #  log_out
  end
end
