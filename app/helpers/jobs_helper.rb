module JobsHelper
  include ApplicationHelper

  #
  # Convert the job objects coming from the API into something the UI can handle
  #
  def jobs_to_uijobs(jobs)
    ui_jobs = []
    jobs.object.each do |job|
      ui_jobs << { id: job.id, name: job.name, cron: cron_to_english(job), command: job.command, timezone: job.timezone,
                   success: bool_icon(job.success), enabled: bool_icon(job.enabled), running: bool_icon(job.running),
                   last_run: last_run(job), next_run: next_run(job), created_at: user_tz(job.created_at),
                   updated_at: user_tz(job.updated_at), success_callback: job.success_callback,
                   failure_callback: job.failure_callback, tags: job.tags }
    end

    ui_jobs
  end

  #
  # Figure out what to display for 'last_run'
  #
  def last_run(job)
    job.running ? I18n.t('common.job_table.running') : user_tz(job.last_run)
  end

  #
  # Figure out what to display for 'next_run'
  #
  def next_run(job)
    return I18n.t('common.job_table.never') unless job.enabled
    return spinner if job.running
    return I18n.t('common.job_table.soon') if DateTime.now > job.next_run
    user_tz(job.next_run)
  end

  #
  # Convert our cryptic cron expressions into plain english for display in the job table
  #
  def cron_to_english(job)
    Cronex::ExpressionDescriptor.new(job.cron, {}, I18n.locale, job.timezone).description
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
        when 'timezone'
          search_params[:timezone] = search
        when 'command'
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
