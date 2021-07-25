class UsersController < ApplicationController
  def update
    @coin = params[:coin]
    user = User.find(current_user.id)
    user.update_attribute(:coin, @coin)
    if user.coin == 0
      user.update_attribute(:coin, 20)
    end
  end
end
