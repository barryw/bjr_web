class JobsController < ApplicationController
  include ApplicationHelper
  include JobsHelper

  before_action :api_client
  before_action :timezones, only: [:new, :edit]

  #
  # This feeds jobs to the job data table. The data table can send us down
  # things like paging information, and searching information which we then
  # need to pass to the BJR server.
  #
  def jobs
    start = params[:start].to_i || 0
    length = params[:length].to_i
    draw = params[:draw].to_i
    search = params[:search][:value]

    page = (start / length) + 1

    search_params = parse_search(search)

    jobs, status_code, headers = @api.jobs(page, length, search_params)
    total_jobs = headers['Total'].to_i

    payload = { recordsTotal: total_jobs, draw: draw, recordsFiltered: total_jobs, data: jobs_to_uijobs(jobs) }

    render json: payload
  end

  #
  # Used by the new/edit job tag lookahead to gather a list of tags already
  # associated with other jobs. This is to help with duplicated tags that
  # only vary slightly
  #
  def tags
    render json: @api.tags
  end

  #
  # Render the 'create job' modal
  #
  def new
    @job = Job.new
    @job.timezone = Time.zone.name
  end

  #
  # Send the job details to the BJR server
  #
  def create
    job = Job.new
    job.name = params[:job][:name] unless params[:job][:name].blank?
    job.cron = params[:job][:cron] unless params[:job][:cron].blank?
    job.command = params[:job][:command] unless params[:job][:command].blank?
    job.tags = params[:job][:tags] unless params[:job][:tags].blank?

    @api.create_job(job)
  rescue BJR::ApiError => ae
    error = JSON.parse(ae.response_body)
    @error = { message: error['message'], title: 'Failed to create job' }
  end

  #
  # Fetch a single job for editing
  #
  def edit
    obj, status_code, headers = @api.job(params[:id])
    job = obj.object

    # TODO: This shit doesn't belong here
    j = Job.new
    j.id = job.id
    j.name = job.name
    j.cron = job.cron
    j.command = job.command
    j.enabled = job.enabled
    j.tags = job.tags.join(',')
    j.timezone = job.timezone
    j.success_callback = job.success_callback
    j.failure_callback = job.failure_callback

    @job = j
  end

  #
  # Update a job
  #
  def update
    opts = {}
    opts[:name] = params[:job][:name] unless params[:job][:name].blank?
    opts[:cron] = params[:job][:cron] unless params[:job][:cron].blank?
    opts[:command] = params[:job][:command] unless params[:job][:command].blank?
    opts[:timezone] = params[:job][:timezone] unless params[:job][:timezone].blank?
    opts[:enabled] = params[:job][:enabled] unless params[:job][:enabled].blank?
    opts[:tags] = params[:job][:tags] unless params[:job][:tags].blank?
    opts[:success_callback] = params[:job][:success_callback] unless params[:job][:success_callback].blank?
    opts[:failure_callback] = params[:job][:failure_callback] unless params[:job][:failure_callback].blank?

    job = BJR::JobIn.new(opts)
    @api.update_job(params[:id], job)
    @id = params[:id]
  rescue BJR::ApiError => ae
    error = JSON.parse(ae.response_body)
    @error = { message: error['message'], title: 'Failed to update job' }
  end

  #
  # Delete a single job
  #
  def destroy
    msg, status_code, headers = @api.delete_job(params[:id])
    head :no_content
  rescue BJR::ApiError => ae
    render json: ae.response_body, status: ae.code
  end

  #
  # Schedule a single job to run now
  #
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
    @timezones = @api.timezones.object
  end
end
