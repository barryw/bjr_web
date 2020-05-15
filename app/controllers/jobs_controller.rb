class JobsController < ApplicationController
  include ApplicationHelper
  include JobsHelper
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
    opts = {}
    opts[:name] = params[:name] unless params[:name].blank?
    opts[:cron] = params[:cron] unless params[:cron].blank?
    opts[:command] = params[:command] unless params[:command].blank?
    opts[:timezone] = params[:timezone] unless params[:timezone].blank?
    opts[:enabled] = params[:enabled] unless params[:enabled].blank?
    opts[:tags] = params[:tags] unless params[:tags].blank?
    opts[:success_callback] = params[:success_callback] unless params[:success_callback].blank?
    opts[:failure_callback] = params[:failure_callback] unless params[:failure_callback].blank?

    job = BJR::JobIn.new(opts)
    msg, status_code, headers = @api.update_job(params[:id], job)
    head :no_content
  rescue BJR::ApiError => ae
    render json: ae.response_body, status: ae.code
  end

  def destroy
    msg, status_code, headers = @api.delete_job(params[:id])
    head :no_content
  rescue BJR::ApiError => ae
    render json: ae.response_body, status: ae.code
  end

  def run_now
    msg, status_code, headers = @api.run_job(params[:id])
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
