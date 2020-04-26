Rails.application.routes.draw do
  root to: 'welcome#new'

  get 'show_profile', to: 'profile#show'
  get 'edit_profile', to: 'profile#edit'
  put 'update_profile', to: 'profile#update'

  get 'dashboard', to: 'home#new', as: 'dashboard'

  post 'logout', to: 'welcome#destroy', as: 'logout'
  post 'login', to: 'welcome#create', as: 'login'

  get 'health', to: 'health#index', as: 'health'
end
