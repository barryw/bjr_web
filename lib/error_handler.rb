module ErrorHandler
  def self.included(clazz)
    clazz.class_eval do
      rescue_from BJR::ApiError, with: :api_error
    end
  end

  private

  def api_error(e)
    if e.code == 401
      reset_session
    end
  end
end

