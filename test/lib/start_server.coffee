_ = require 'underscore'
BackboneORM = require 'backbone-orm'
RestController = require 'backbone-rest'

MODELS = (require 'backbone-orm/test/lib/generate_models')({sync: BackboneORM.sync})

http = require 'http'
express = require 'express'
cors = require 'cors'

app = express(); app.set 'port', 5555; app.use(cors()); app.use(express.bodyParser())

for model_type in MODELS
  new RestController(app, {model_type: model_type, route: _.result(new model_type, 'url').replace("localhost:#{app.get('port')}", '')})

http.createServer(app).listen app.get('port'), -> console.log "Test server started on #{app.get('port')}"
