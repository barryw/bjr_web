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
      ui_jobs << { id: job.id, name: job.name, cron: job.cron, command: job.command,
                   timezone: job.timezone, success: job.success, enabled: job.enabled, running: job.running, last_run: job.last_run,
                   next_run: job.next_run, created_at: job.created_at, updated_at: job.updated_at, success_callback: job.success_callback,
                   failure_callback: job.failure_callback, tags: job.tags.join(',') }
    end

    ui_jobs
  end

  #
  # Convert our cryptic cron expressions into plain english for display in the job table
  #
  def cron_to_english(cron)
    Cronex::ExpressionDescriptor.new(cron, locale: I18n.locale).description
  rescue
    ''
  end
end
