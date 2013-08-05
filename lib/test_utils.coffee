util = require 'util'
express = require 'express'
_ = require 'underscore'
Backbone = require 'backbone'
RestController = require 'backbone-rest'

mock_models = {}

module.exports = class TestUtils
  @mockRequest: (model_type) ->
    mock_model_type = TestUtils.mockModel(model_type)
    mock_model_type.schema() # initialize

    app = express(); app.use(express.bodyParser())
    url = _.result(model_type.prototype, 'url')
    controller = new RestController(app, {model_type: mock_model_type, route: url}) # implicit knowledge of backbone-rest tests
    return require('supertest')(app)

  @mockModel: (model_type) ->
    return mock_model_type if mock_model_type = mock_models[model_type.model_name]
    schema = {}
    class MockModel extends Backbone.Model
      @model_name: model_type.model_name
      @schema: schema
    mock_models[model_type.model_name] = MockModel

    compiled_schema = model_type.schema()
    schema[key] = field for key, field of compiled_schema.fields
    for key, relation of compiled_schema.relations
      schema[key] = [relation.type, TestUtils.mockModel(relation.model_type)]

    MockModel::sync = require('backbone-orm/memory_sync')(MockModel)
    return  MockModel