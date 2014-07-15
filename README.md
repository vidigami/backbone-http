[![Build Status](https://secure.travis-ci.org/vidigami/backbone-http.png)](http://travis-ci.org/vidigami/backbone-http)

![logo](https://github.com/vidigami/backbone-http/raw/master/media/logo.png)

BackboneHTTP provides an HTTP interface that can be used in the browser or from Node.js.

This allows for a iteration of remote collections from the browser using BackboneORM's unified query syntax and iteration methods.

#### Examples (CoffeeScript)

```coffeescript
class Project extends Backbone.Model
  urlRoot: '/projects'
  sync: require('backbone-http').sync(Project)

# Find all items with is_active = true
Project.find {is_active: true}, (err, projects) ->

# Iterate through all items with is_active = true in batches of 200
Project.each {is_active: true, $each: {fetch: 200}},
  ((project, callback) -> ),
  (err) -> console.log 'Done'

# Stream all items with is_active = true in batches of 200
Project.stream({is_active: true, $each: {fetch: 200}})
  .pipe(new ModelStringifier())
  .on('finish', -> console.log 'Done')
```

#### Examples (JavaScript)

```javascript
var Project = Backbone.Model.extend({
  urlRoot: '/projects'
});
Project.prototype.sync = require('backbone-http').sync(Project);

// Find all items with is_active = true
Project.find({is_active: true}, function(err, projects) {});

// Iterate through all items with is_active = true in batches of 200
Project.each({is_active: true, $each: {fetch: 200}},
  function(project, callback) {},
  function(err) {return console.log('Done');}
);

// Stream all items with is_active = true in batches of 200
Project.stream({is_active: true, $each: {fetch: 200}})
  .pipe(new ModelStringifier())
  .on('finish', function() {return console.log('Done');});
```


Please [checkout the website](http://vidigami.github.io/backbone-orm/backbone-http.html) for installation instructions, examples, documentation, and community!


### For Contributors

To build the library for Node.js:

```
$ npm run build
```

To build the library for the browser:

```
$ npm run release
```

Please run tests before submitting a pull request.

```
$ npm test
```

Tests can be run with mocha directly with `mocha 'node_modules/backbone-orm/test/spec/**/*.coffee'`

Tests may be run in the browser with `karma start ./config/karma/manual-config.coffee`

Tests may be debugged in the browser with `karma start --no-single-run --browsers Chrome ./config/karma/manual-config.coffee`, and opening up the debug tab
