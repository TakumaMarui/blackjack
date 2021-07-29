Rails.application.routes.draw do
  get 'profiles/index'
  devise_for :users
  get 'games/index'
  get 'users/update'
  post 'users/update'
  root to: "games#index"
  resources :users, only: [:index, :update, :show]
end
