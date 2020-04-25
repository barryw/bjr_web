# frozen_string_literal: true

desc 'Build BJR Web Docker image'
task 'build:docker' do |_t, _args|
  sh 'docker build . -t barrywalker71/bjr_web:latest'
end

desc 'Push the BJR Web Docker image to DockerHub'
task 'build:docker:push' do |_t, _args|
  sh 'docker push barrywalker71/bjr_web:latest'
end
