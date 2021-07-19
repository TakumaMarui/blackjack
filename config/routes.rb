Rails.application.routes.draw do
  devise_for :users
  get 'games/index'
  root to: "games#index"
end
