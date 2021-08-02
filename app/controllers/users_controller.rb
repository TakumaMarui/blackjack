class UsersController < ApplicationController
  before_action :authenticate_user!, only: [:edit, :update]
  before_action :set_user, only: [:show, :edit]
  def index
    @user = User.all.order(coin: :desc)
  end

  def show
  end
  
  def edit
  end

  def update_coin
    @coin = params[:coin]
    user = User.find(current_user.id)
    user.update_attribute(:coin, @coin)
    if user.coin <= 0
      user.update_attribute(:coin, 20)
    end
  end

  def update
    if current_user.update(user_params)
      redirect_to user_path
    else
      render :edit
    end
  end

  private
  def user_params
    params.require(:user).permit(:profile, :image)
  end

  def set_user
    @user = User.find(params[:id])
  end
end

