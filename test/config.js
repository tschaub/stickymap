module.exports = function(config) {
  config.set({
    frameworks: ['browserify', 'mocha'],
    browsers: ['Chrome'],
    files: [
      '**/*.spec.js'
    ],
    preprocessors: {
      '**/*.js': ['browserify']
    },
    browserify: {
      debug: true
    }
  });
};
