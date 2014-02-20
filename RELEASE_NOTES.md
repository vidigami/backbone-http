Please refer to the following release notes when upgrading your version of BackboneHTTP.

### 0.5.5
* publish on component. Removed client dependency on inflection by burning into library.

### 0.5.4
* Compatability fix for Backbone 1.1.1

### 0.5.3
* Added beforeSend option to sync. `sync: require('backbone-http').sync(Model, {beforeSend: (req) -> req.set({Authorization: 'Bearer XYZ'})})`

### 0.5.2
* AMD module improvements: made anonymous definition and added require
* Global symbol: gave own name BackboneHTTP instead of Backbone.HTTP

### 0.5.1
* Safer inspect implementation

### 0.5.0
* Initial release
