util = require 'util'
express = require 'express'
_ = require 'underscore'
Backbone = require 'backbone'
RestController = require 'backbone-rest'

createMockModel = (mock_model_types, model_type) ->
  return mock_model_type if mock_model_type = mock_model_types[model_type.model_name]

  compiled_schema = model_type.schema()
  schema = _.clone(compiled_schema.raw)
  for key, relation of compiled_schema.relations
    do (key, relation) ->
      schema[if relation.as then key else "mock_#{key}"] = ->
        field = compiled_schema.raw[key]
        field = field() if _.isFunction(field)
        field = _.clone(field)
        relation = model_type.relation(key)
        if relation.join_table
          mock_join_table = createMockModel(mock_model_types, relation.join_table)
          mock_model_types[mock_join_table.model_name] = mock_join_table
          join_table_info = {join_table: createMockModel(mock_model_types, relation.join_table)}
          if field.length is 2 then field.push(join_table_info) else _.extend(field[2], join_table_info)
        return field

  class MockModel extends Backbone.Model
    @model_name: "Mock#{model_type.model_name}"
    @schema: schema
    sync: require('backbone-orm/memory_sync')(MockModel)

  return mock_model_types[model_type.model_name] = MockModel


module.exports = (model_types, callback) ->
  mock_model_types = {}

  # initialize all to ensure the reverse relationships are configured
  model_type.schema() for model_type in model_types

  for model_type in model_types
    compiled_schema = model_type.schema()
    sync = model_type::sync('sync')
    sync = sync.wrapped_sync_fn('sync') if sync.wrapped_sync_fn # cache

    mock_model_type = createMockModel(mock_model_types, model_type)

    # configure the mock request
    app = express(); app.use(express.bodyParser())
    url = _.result(model_type.prototype, 'url')
    controller = new RestController(app, {model_type: mock_model_type, route: url}) # implicit knowledge of backbone-rest tests
    sync.request = require('supertest')(app)

  # ensure all models are initialized
  mock_model_type.schema() for key, mock_model_type of mock_model_types
  callback()
