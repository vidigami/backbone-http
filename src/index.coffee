# ensure the client symbols are resolved
require('backbone-orm/lib/client_utils').loadDependencies([{symbol: 'superagent', path: 'superagent'}])

module.exports =
  sync: require './sync'
