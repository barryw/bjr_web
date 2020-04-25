class JsonWebToken
  class << self
    def decode(token)
      body = JWT.decode(token, Rails.application.secret_key_base)[0]
      HashWithIndifferentAccess.new body
    rescue StandardError
      nil
    end
  end
end
