class HealthController < ApplicationController
  skip_before_action :ensure_session

  def index
    head :ok
  end
end
