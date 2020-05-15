module JobsHelper
  include ApplicationHelper

  #
  # Convert the job objects coming from the API into something the UI can handle
  #
  def jobs_to_uijobs(jobs)
    ui_jobs = []
    jobs.object.each do |job|
      ui_jobs << { id: job.id, name: job.name, cron: job.cron, command: job.command, timezone: job.timezone,
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
    job.running ? 'running...' : user_tz(job.last_run)
  end

  #
  # Figure out what to display for 'next_run'
  #
  def next_run(job)
    return 'job is disabled' unless job.enabled
    return spinner if job.running
    return 'soon' if DateTime.now > job.next_run
    user_tz(job.next_run)
  end
end
