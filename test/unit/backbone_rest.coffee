_ = require 'underscore'
express = require 'express'

module.exports = (options, callback) ->
  test_parameters =
    app_factory: -> app = express(); app.use(express.bodyParser()); app

  require('backbone-rest/test/generators/all')(_.extend(test_parameters, options), callback)
