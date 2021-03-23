module.exports = function(config) {
  config.set({
    frameworks: ['source-map-support', 'browserify', 'mocha'],
    browsers: ['ChromeHeadless'],
    files: ['**/*.spec.js', {pattern: 'fixtures/**/*', included: false}],
    preprocessors: {
      '**/*.js': ['browserify']
    },
    browserify: {
      debug: true
    },
    client: {
      runInParent: true
    }
  });
};
