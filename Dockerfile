FROM ruby:2.6.6-slim

MAINTAINER Barry Walker <barrywalker@gmail.com>

WORKDIR /app

ADD Gemfile /app
ADD Gemfile.lock /app

RUN apt-get update -y \
    && apt-get upgrade -y \
    && apt-get install -y build-essential libxml2-dev libxslt-dev default-libmysqlclient-dev \
                          curl wget jq ca-certificates tzdata libffi-dev ncat nodejs yarn \
    && gem install bundler \
    && bundle install --without=development test \
    && apt-get remove -y build-essential \
    && apt-get autoremove -y

ADD . /app

RUN RAILS_ENV=production bundle exec rake assets:precompile

ENTRYPOINT ["/app/entrypoint.sh"]
