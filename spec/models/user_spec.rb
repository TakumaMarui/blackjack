require 'rails_helper'

RSpec.describe User, type: :model do
  describe '#create' do
    before do
      @user = FactoryBot.build(:user)
    end
    context "新規登録ができるとき" do
      it "全ての値が正しく入力されていると保存できること" do
        expect(@user).to be_valid
      end
      it "profileが空でも保存できること" do
        @user.profile = ''
        expect(@user).to be_valid
      end
      it "imageが空でも保存できること" do
        @user.image = nil
        expect(@user).to be_valid
      end
    end
    context "新規登録ができないとき" do
      it "nicknameが空だと保存できないこと" do
        @user.nickname = ''
        @user.valid?
        expect(@user.errors.full_messages).to include("Nickname can't be blank")
      end
      it "emailが空だと保存できないこと" do
        @user.email = ''
        @user.valid?
        expect(@user.errors.full_messages).to include("Email can't be blank")
      end
      it "emailが一意性であること" do
        @user.save
        another_user = FactoryBot.build(:user, email: @user.email)
        another_user.valid?
        expect(another_user.errors.full_messages).to include('Email has already been taken')
      end
      it "emailは、@を含む必要があること" do
        @user.email = 'aaaaaa'
        @user.valid?
        expect(@user.errors.full_messages).to include("Email is invalid")
      end
      it "passwordが空だと保存できないこと" do
        @user.password = ''
        @user.valid?
        expect(@user.errors.full_messages).to include("Password can't be blank")
      end
      it "passwordは、6文字以上での入力が必要であること" do
        @user.password = '1a'
        @user.password_confirmation = '1a'
        @user.valid?
        expect(@user.errors.full_messages).to include("Password is too short (minimum is 6 characters)")
      end
      it "passwordは、半角数字のみだと登録できないこと" do
        @user.password = '123456'
        @user.password_confirmation = '123456'
        @user.valid?
        expect(@user.errors.full_messages).to include("Password is invalid")
      end
      it "passwordは、半角英字のみだと登録できないこと" do
        @user.password = 'aaaaaa'
        @user.password_confirmation = 'aaaaaa'
        @user.valid?
        expect(@user.errors.full_messages).to include("Password is invalid")
      end
      it "passwordとpassword_confirmationは、値の一致が必要であること" do
        @user.password = '12345a'
        @user.password_confirmation = '12345ab'
        @user.valid?
        expect(@user.errors.full_messages).to include("Password confirmation doesn't match Password")
      end
    end
  end
end
