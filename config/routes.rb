Rails.application.routes.draw do
  root to: 'session#new'

  get 'show_profile', to: 'profile#show'
  get 'edit_profile', to: 'profile#edit'
  put 'update_profile', to: 'profile#update'

  get 'dashboard', to: 'home#new', as: 'dashboard'

  resources :folders, only: [:create, :update, :get, :index, :destroy]
  get 'folders/:id/jobs', to: 'folders#jobs', as: 'folder_jobs'

  resources :jobs
  get 'job_list', to: 'jobs#jobs', as: 'job_list'
  get 'jobs/:id/runs', to: 'jobs#runs', as: 'job_runs'
  post 'jobs/:id/run_now', to: 'jobs#run_now', as: 'run_now'
  get 'tags', to: 'jobs#tags', as: 'tags'
  get 'parse_cron', to: 'jobs#parse_cron', as: 'parse_cron'

  # Get and update the status of context-sensitive help
  get 'help', to: 'help#show', as: 'show_help_status'
  post 'help', to: 'help#update', as: 'update_help_status'

  # Manage session
  post 'login', to: 'session#create', as: 'login'
  post 'logout', to: 'session#destroy', as: 'logout'

  # Home page stats
  get 'job_stats', to: 'home#job_stats', as: 'job_stats'
  get 'todays_stats', to: 'home#todays_stats', as: 'todays_stats'
  get 'upcoming_jobs', to: 'home#upcoming_jobs', as: 'upcoming_jobs'
  get 'recent_jobs', to: 'home#recent_jobs', as: 'recent_jobs'

  # Get the timezones that the BJR server understands
  get 'timezones', to: 'home#timezones', as: 'timezones'

  # Health check
  get 'health', to: 'health#index', as: 'health'
end
