Rails.application.config.session_store :redis_session_store, {
  key: 'bjr_web',
  redis: {
    expire_after: ENV.fetch('JWT_EXPIRY_SECONDS', 3600).to_i,
    ttl: ENV.fetch('JWT_EXPIRY_SECONDS', 3600).to_i,
    key_prefix: 'bjr_web:session:',
    url: "redis://#{ENV.fetch('REDIS_HOST', 'localhost')}:#{ENV.fetch('REDIS_PORT', 6379)}/#{ENV.fetch('REDIS_SESSION_DB', 1)}"
  }
}
