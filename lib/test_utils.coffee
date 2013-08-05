util = require 'util'
express = require 'express'
_ = require 'underscore'
Backbone = require 'backbone'
RestController = require 'backbone-rest'

MOCK_MODELS = {}

module.exports = class TestUtils
  @mockRequest: (model_type) ->
    mock_model_type = TestUtils.mockModel(model_type)
    mock_model_type.schema() # initialize

    app = express(); app.use(express.bodyParser())
    url = _.result(model_type.prototype, 'url')
    controller = new RestController(app, {model_type: mock_model_type, route: url}) # implicit knowledge of backbone-rest tests
    return require('supertest')(app)

  @mockModel: (model_type) ->
    return mock_model_type if mock_model_type = MOCK_MODELS[model_type.model_name]

    compiled_schema = model_type.schema()
    relation.join_table.schema() for key, relation of compiled_schema.relations when relation.join_table # initialize

    schema = _.clone(compiled_schema.raw)
    for key, relation of compiled_schema.relations
      do (key, relation) ->
        schema[key] = ->
          field = compiled_schema.raw[key]
          field = field() if _.isFunction(field)
          field = _.clone(field)
          relation = model_type.relation(key)
          if relation.join_table
            join_table_info = {join_table: TestUtils.mockModel(relation.join_table)} # override existing join table
            MOCK_MODELS[join_table_info.join_table.model_name] = join_table_info.join_table
            if field.length is 2 then field.push(join_table_info) else _.extend(field[2], join_table_info)
          return field

    class MockModel extends Backbone.Model
      @model_name: model_type.model_name
      @schema: schema
      sync: require('backbone-orm/memory_sync')(MockModel)

    return MOCK_MODELS[model_type.model_name] = MockModel
