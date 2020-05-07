FROM ruby:2.6.6-slim

MAINTAINER Barry Walker <barrywalker@gmail.com>

WORKDIR /app

ADD Gemfile /app
ADD Gemfile.lock /app

RUN apt-get update -y \
    && apt-get upgrade -y \
    && apt-get install -y build-essential libxml2-dev libxslt-dev default-libmysqlclient-dev \
                          curl wget jq ca-certificates tzdata libffi-dev ncat git \
    && curl -sL https://deb.nodesource.com/setup_14.x | bash - \
    && curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
    && apt-get update -y \
    && apt-get install -y nodejs yarn \
    && gem install bundler \
    && bundle install --without=development test \
    && apt-get remove -y build-essential \
    && apt-get autoremove -y

ADD . /app

RUN RAILS_ENV=production bundle exec rake assets:precompile

ENTRYPOINT ["/app/entrypoint.sh"]
