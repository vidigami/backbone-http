require 'node-jquery-xhr'
delete global.window
module.exports = require('backbone').$ = global.$
