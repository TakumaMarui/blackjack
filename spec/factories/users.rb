FactoryBot.define do
  factory :user do
    nickname              {Faker::Name.last_name}
    email                 {Faker::Internet.free_email}
    password = '1a' + Faker::Internet.password(min_length: 6)
    password {password}
    password_confirmation {password}
    profile               {"a"}

    after(:build) do |user|
      user.image.attach(io: File.open('public/images/test_image.png'), filename: 'test_image.png')
    end
  end
end
