module.exports =
  basePath: '.'
  frameworks: ['mocha', 'chai']
  preprocessors: {'**/*.coffee': ['coffee']}

  coffeePreprocessor:
    options: {bare: true, sourceMap: false}
    transformPath: (path) -> path.replace(/\.coffee$/, '.js')

  reporters: ['spec']
  port: 9876
  colors: true
  logLevel: 'INFO'
  browsers: ['PhantomJS'] # ['Firefox', 'Chrome', 'Safari']
  singleRun: true
