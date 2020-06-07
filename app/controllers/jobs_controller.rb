class JobsController < ApplicationController
  include ApplicationHelper
  include JobsHelper

  before_action :api_client
  before_action :timezones, only: [:new, :edit]
  before_action :params_to_job, only: [:create, :update]

  #
  # Retrieve a paginated list of jobs to display in the table
  #
  def jobs
    page = params[:page]
    per_page = params[:per_page]
    search = params[:search] || ''

    jobs, status_code, headers = @api.jobs(page, per_page, search)
    total_jobs = headers['Total'].to_i

    render json: { total: total_jobs, data: jobs_to_uijobs(jobs) }, status: status_code
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
  # Send the new job details to the BJR server
  #
  def create
    @api.create_job(@job)
    head :created
  rescue BJR::ApiError => ae
    error = JSON.parse(ae.response_body)
    render json: { message: error['message'], title: 'Failed to create job' }, status: error['status_code']
  end

  #
  # Update a job
  #
  def update
    render json: @api.update_job(@job), status: :ok
  rescue BJR::ApiError => ae
    error = JSON.parse(ae.response_body)
    render json: { message: error['message'], title: "Failed to update job #{@job.id}" }, status: error['status_code']
  end

  #
  # Delete a single job
  #
  def destroy
    render json: @api.delete_job(params[:id]), status: :no_content
  rescue BJR::ApiError => ae
    error = JSON.parse(ae.response_body)
    render json: { message: error['message'], title: "Failed to delete job #{params[:id]}" }, status: error['status_code']
  end

  #
  # Retrieve runs for a job
  #
  def runs
    data, status, headers = @api.job_runs(params[:id], params[:page], params[:per_page])
    total_runs = headers['Total'].to_i
    render json: { total: total_runs, data: data.object }, status: :ok
  rescue BJR::ApiError => ae
    error = JSON.parse(ae.response_body)
    render json: { message: error['message'], title: "Failed to retrieve job runs for job ID #{params[:id]}" }, status: error['status_code']
  end

  #
  # Schedule a single job to run now
  #
  def run_now
    msg, status_code, headers = @api.run_job(params[:id])
    head :accepted
  rescue BJR::ApiError => ae
    error = JSON.parse(ae.response_body)
    render json: { message: error['message'], title: "Failed to run job #{params[:id]}" }, status: error['status_code']
  end

  #
  # Accepts a cron expression and returns the cron expression in English. Used in the AJAX call
  # to display the cron expression in a nicer way on the job create/edit modal.
  #
  def parse_cron
    cron = params[:cron]
    timezone = params[:timezone]

    description = cron_to_english(cron)
    render json: { expression: cron, timezone: timezone, description: description }
  end

  private

  #
  # Convert incoming params to a job object
  #
  def params_to_job
    @job = Job.new
    @job.id = params[:id] unless params[:id].blank?
    @job.name = params[:job][:name] unless params[:job][:name].blank?
    @job.cron = params[:job][:cron] unless params[:job][:cron].blank?
    @job.command = params[:job][:command] unless params[:job][:command].blank?
    @job.timezone = params[:job][:timezone] unless params[:job][:timezone].blank?
    @job.enabled = params[:job][:enabled] unless params[:job][:enabled].blank?
    @job.tags = params[:job][:tags]
    @job.success_callback = params[:job][:success_callback] unless params[:job][:success_callback].blank?
    @job.failure_callback = params[:job][:failure_callback] unless params[:job][:failure_callback].blank?
  end

  def api_client
    @api = ApiClient.new(current_user)
  end

  def timezones
    @timezones = @api.timezones.object
  end
end
