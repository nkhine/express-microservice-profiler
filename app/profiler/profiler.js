(function () {

  'use strict';
  /**
   * Provides means to measure middleware completion speed
   * @module profiling
   */

  exports.startProfiling = startProfiling;
  exports.recordStats = recordStats;
  exports.label = label;

  /**
     * Overrides the app.use function to handle prifiling
     * @param app {Object} handles the app object
     * @member profiler
     * @returns {Object} Returns the new app object
     */
  function startProfiling (app) {
    var expressUse = app.use;
    app.use = function() {
      for (var i in arguments) {
        if (arguments.hasOwnProperty(i) && typeof arguments[i] === 'function') {
          updateArguments(arguments, i, expressUse)
        }
      }
      return expressUse.apply(app, arguments);
    };
    return app;
  }

  function updateArguments(args, i, expressUse) {
    var oldMIddleware = args[i];
    args[i] = function(req, res, next) {
      var startTime = process.hrtime();
      var startDate = new Date();
      return oldMIddleware(req, res, function(err) {
        var duration = process.hrtime(startTime);
        var middlewareName = oldMIddleware.name;
        req.profilingStats = req.profilingStats || [];

        req.profilingStats.push({
          name: middlewareName,
          timeStarted: startDate,
          duration: duration[1] / 1000000000
        });
        return next(err);
      });
    };
  }

  /**
   * Records statistics
   * @member recordStats
   * @param cb {Function} callback function that handles statistics
   * @returns {Function} express middleware
   */
  function recordStats(cb) {
    return function(req, res, next) {
      cb(req.profilingStats);
      next();
    };
  }

  /**
   * Wraps a middleware function into a named function
   * @member label
   * @param name {String} Name to add to the middleware 
   * @returns {Function} express middleware
   */
  function label(name, middleware) {
    return (new Function('return function (call) { return function ' + name + // jshint ignore:line
      ' () { return call(this, arguments) }; };')())(Function.apply.bind(middleware));
  }

})();

