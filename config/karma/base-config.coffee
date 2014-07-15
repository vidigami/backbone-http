module.exports =
  basePath: '.'
  frameworks: ['mocha', 'chai']
  preprocessors: {'**/*.coffee': ['coffee']}

  coffeePreprocessor:
    options: {bare: true, sourceMap: false}
    transformPath: (path) -> path.replace(/\.coffee$/, '.js')

  reporters: ['dots']
  port: 9876
  colors: true
  logLevel: 'INFO'
  # see https://github.com/karma-runner/karma-safari-launcher/issues/6 if you're having problems with safari
  browsers: ['PhantomJS'] # ['Firefox', 'Chrome', 'Safari']
  singleRun: true
