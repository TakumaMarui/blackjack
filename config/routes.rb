Rails.application.routes.draw do
  devise_for :users
  get 'games/index'
  get 'users/update'
  post 'users/update'
  root to: "games#index"
  resources :users, only: [:index, :update]
end
