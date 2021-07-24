class UsersController < ApplicationController
  def update
    @coin = params[:coin]
    user = User.find(current_user.id)
    user.update_attribute(:coin, @coin)
  end
end
