class JobsController < ApplicationController
  include ApplicationHelper
  before_action :timezones, only: [:index]
  before_action :api_client

  def jobs
    start = params[:start].to_i || 0
    length = params[:length].to_i
    draw = params[:draw].to_i
    search = params[:search][:value]

    page = (start / length) + 1

    jobs, status_code, headers = @api.jobs(page, length)
    total_jobs = headers['Total'].to_i

    payload = { recordsTotal: total_jobs, draw: draw, recordsFiltered: total_jobs, data: jobs_to_uijobs(jobs) }

    render json: payload
  end

  def index
  end

  def create
  end

  def update
  end

  def destroy
    msg, status_code, headers = @api.delete_job(params[:id])
    head :no_content
  rescue BJR::ApiError => ae
    render json: ae.response_body, status: ae.code
  end

  private

  def api_client
    @api = ApiClient.new(current_user)
  end

  def timezones
    api = ApiClient.new(current_user)
    @timezones = api.timezones.object
  end
end
