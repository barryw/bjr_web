# frozen_string_literal: true

require 'json'

desc 'Bump the versions of BJR Web'
task 'version', [:position] => [:environment] do |_t, _args|
  Rake::Task["spec"].invoke

  cur_ver = File.read('.version').strip
  position = _args[:position]

  major, minor, patch = cur_ver.split('.')
  new_ver = ''
  case position
  when 'major'
    new_ver = "#{major.to_i + 1}.0.0"
  when 'minor'
    new_ver = "#{major}.#{minor.to_i + 1}.0"
  when 'patch'
    new_ver = "#{major}.#{minor}.#{patch.to_i + 1}"
  else
    raise 'position must be major, minor or patch'
  end
  puts "Bumping BJR Web version from #{cur_ver} -> #{new_ver}"

  File.write('.version', "#{new_ver}\n")
end
