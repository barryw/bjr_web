module JobsHelper
  include ApplicationHelper
  include ActionView::Helpers::UrlHelper

  attr_accessor :output_buffer

  #
  # Convert the job objects coming from the API into something the UI can handle
  #
  def jobs_to_uijobs(jobs)
    ui_jobs = []
    jobs.object.each do |job|
      ui_jobs << { id: job.id, edit: job_edit_link(job), name: job.name, cron: job.cron, command: job.command,
                   timezone: job.timezone, success: job.success, enabled: job.enabled, running: job.running, last_run: job.last_run,
                   next_run: job.next_run, created_at: job.created_at, updated_at: job.updated_at, success_callback: job.success_callback,
                   failure_callback: job.failure_callback, tags: job.tags.join(',') }
    end

    ui_jobs
  end

  #
  # Create a link to allow us to edit a job
  #
  def job_edit_link(job)
    link_to edit_job_path(job.id), remote: true do
      content_tag(:i, '', class: 'icon-note').html_safe
    end
  end

  #
  # Convert our cryptic cron expressions into plain english for display in the job table
  #
  def cron_to_english(cron)
    Cronex::ExpressionDescriptor.new(cron, locale: I18n.locale).description
  rescue
    ''
  end

  #
  # Pick apart the string that the job data table sends us for searching and give us
  # back things we can pass to the BJR server
  #
  def parse_search(search)
    search_params = {}

    # Are we trying to search on specific attribute, or just generic keywords?
    search.split(' ').each do |group|
      if group =~ /:/
        attribute, search = group.split(':')
        case attribute
        when 'name'
          search_params[:name] = search
        when 'tags'
          search_params[:tags] = search
        when 'tag'
          search_params[:tags] = search
        when 'timezone'
          search_params[:timezone] = search
        when 'tz'
          search_params[:timezone] = search
        when 'command'
          search_params[:command] = search
        when 'cmd'
          search_params[:command] = search
        end
      else
        case group
        when 'running'
          search_params[:running] = '1'
        when 'stopped'
          search_params[:running] = '0'
        when 'enabled'
          search_params[:enabled] = '1'
        when 'disabled'
          search_params[:enabled] = '0'
        when 'succeeded'
          search_params[:succeeded] = '1'
        when 'failed'
          search_params[:succeeded] = '0'
        end
      end
    end

    search_params
  end
end
