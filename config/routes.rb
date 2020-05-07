Rails.application.routes.draw do
  root to: 'session#new'

  get 'show_profile', to: 'profile#show'
  get 'edit_profile', to: 'profile#edit'
  put 'update_profile', to: 'profile#update'

  get 'dashboard', to: 'home#new', as: 'dashboard'

  get 'jobs', to: 'jobs#index', as: 'list_jobs'

  post 'login', to: 'session#create', as: 'login'
  post 'logout', to: 'session#destroy', as: 'logout'

  get 'job_stats', to: 'home#job_stats', as: 'job_stats'
  get 'upcoming_jobs', to: 'home#upcoming_jobs', as: 'upcoming_jobs'
  get 'recent_jobs', to: 'home#recent_jobs', as: 'recent_jobs'

  get 'health', to: 'health#index', as: 'health'
end
