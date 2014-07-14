_ = require 'underscore'
BackboneORM = require 'backbone-orm'
{Queue} = BackboneORM
RestController = require 'backbone-rest'

MODELS = (require 'backbone-orm/test/lib/generate_models')({sync: BackboneORM.sync})

http = require 'http'
express = require 'express'
cors = require 'cors'

app = express(); app.set 'port', 5555; app.use(cors()); app.use(express.bodyParser())

for model_type in MODELS
  new RestController(app, {model_type: model_type, route: _.result(new model_type, 'url').replace("localhost:#{app.get('port')}", '')})

server_ready_queue = new Queue(1)
server_ready_queue.defer (callback) ->
  http.createServer(app).listen app.get('port'), -> console.log "Test server started on #{app.get('port')}"; callback()

module.exports.onReady = (callback) ->
  server_ready_queue.defer (queue_callback) -> callback(); queue_callback()
