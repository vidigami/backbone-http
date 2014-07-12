wrench = require 'wrench'
path = require 'path'
fs = require 'fs'

# TODO: determine if browser tests should always use bower versions, or if npm versions are fine
try bower_dir = fs.readdirSync('bower_components')
# remember, order matters for these browser dependancies
if bower_dir?.length
  local_dependancies = ['./bower_components/underscore/underscore.js', './bower_components/backbone/backbone.js', './bower_components/moment/moment.js', './bower_components/superagent/superagent.js',]
else
  local_dependancies = (path.relative('.', require.resolve(module_name)) for module_name in ['underscore', 'backbone', 'moment']).concat(['./node_modules/superagent/superagent.js'])
local_dependancies.push(path.relative('.',require.resolve('backbone-orm/stream.js')))

tests_core = []
tests_core = tests_core.concat (path.join('node_modules/backbone-orm', filename) for filename in (require 'backbone-orm/config/files').tests_core)
# local updated tests do not yet exist
# tests_core[-1..] = ("./test/spec/#{filename}" for filename in wrench.readdirSyncRecursive('./test/spec') when /\.coffee$/.test(filename))

module.exports =
  local_dependancies: local_dependancies

  test_parameters: './test/parameters.coffee'
  tests_core: tests_core
  tests_webpack: ("./config/builds/test/#{filename}" for filename in wrench.readdirSyncRecursive('./config/builds/test') when /\.webpack.config.coffee$/.test(filename))
