module.exports = function(config) {
  config.set({
    frameworks: ['source-map-support', 'mocha'],
    browsers: ['ChromeHeadless'],
    files: ['**/*.spec.js', {pattern: 'fixtures/**/*', included: false}],
    preprocessors: {
      '**/*.js': ['esbuild']
    },
    client: {
      runInParent: true
    }
  });
};
