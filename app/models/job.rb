class Job
  include ActiveModel::Validations
  include ActiveModel::Conversion
  extend ActiveModel::Naming

  validates :name, presence: true
  validates :cron, presence: true
  validates :command, presence: true

  attr_accessor :id, :name, :cron, :enabled, :command, :last_run, :next_run, :success, :running, :timezone, :tags, :created_at, :updated_at, :success_callback, :failure_callback

  def as_json(_options = {})
    {
      id: id,
      name: name,
      cron: cron,
      enabled: enabled,
      command: command,
      last_run: last_run,
      next_run: next_run,
      success: success,
      running: running,
      timezone: timezone,
      tags: tags,
      created_at: created_at,
      updated_at: updated_at,
      success_callback: success_callback,
      failure_callback: failure_callback
    }
  end

  def persisted?
    !id.nil?
  end
end
