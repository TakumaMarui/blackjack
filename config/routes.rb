Rails.application.routes.draw do
  get 'rules/index'
  get 'profiles/index'
  devise_for :users
  get 'games/index'
  get 'users/update_coin'
  root to: "games#index"
  resources :users, only: [:index, :edit, :update, :show] do
    collection do
      get 'update_coin'
    end
  end
  resources :rules, only: :index
end
