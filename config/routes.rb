Rails.application.routes.draw do
  root to: 'session#new'

  get 'show_profile', to: 'profile#show'
  get 'edit_profile', to: 'profile#edit'
  put 'update_profile', to: 'profile#update'

  get 'dashboard', to: 'home#new', as: 'dashboard'

  resources :jobs
  get 'job_list', to: 'jobs#jobs', as: 'job_list'
  post 'jobs/:id/run_now', to: 'jobs#run_now', as: 'run_now'

  post 'login', to: 'session#create', as: 'login'
  post 'logout', to: 'session#destroy', as: 'logout'

  get 'job_stats', to: 'home#job_stats', as: 'job_stats'
  get 'todays_stats', to: 'home#todays_stats', as: 'todays_stats'
  get 'upcoming_jobs', to: 'home#upcoming_jobs', as: 'upcoming_jobs'
  get 'recent_jobs', to: 'home#recent_jobs', as: 'recent_jobs'

  get 'health', to: 'health#index', as: 'health'
end
