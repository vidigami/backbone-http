_ = require 'underscore'
BackboneORM = require 'backbone-orm'
{Queue} = BackboneORM
RestController = require 'backbone-rest'

http = require 'http'
express = require 'express'
cors = require 'cors'

server = null; retain_count = 0

module.exports =
  start: (callback) ->
    return callback(new Error 'Cannot start server. It is already running') if server

    app = express(); app.set 'port', 4887; app.use(cors()); app.use(express.bodyParser())

    for model_type in (require 'backbone-orm/test/lib/generate_models')({sync: BackboneORM.sync})
      new RestController(app, {model_type: model_type, route: _.result(new model_type, 'url').replace("localhost:#{app.get('port')}", '')})

    server = http.createServer(app)
    module.exports.server or= server
    server.on 'error', (err) -> console.log "Error when starting or running test server on :#{app.get('port')}\n#{err.stack or err}"; callback?(err)
    server.listen app.get('port'), ->
      console.log "Test server started on :#{app.get('port')}"; callback?(null, server)

  retain: ->
    throw new Error 'Cannot retain server. It is not running' unless server
    retain_count++

  release: (err) ->
    throw new Error 'Cannot release server. It is not running' unless server
    return unless --retain_count <= 0
    process.exit(if err then 1 else 0)
