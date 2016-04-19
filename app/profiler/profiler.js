(function () {

  'use strict';
  /**
   * Provides means to measure middleware completion speed
   * @module profiling
   */

  exports.startProfiling = startProfiling;
  exports.recordStats = recordStats;

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
          var oldMIddleware = arguments[i];
          arguments[i] = function(req, res, next) {
            var startTime = process.hrtime();
            var startDate = new Date();
            return oldMIddleware(req, res, function(err) {
              var duration = process.hrtime(startTime);
              var middlewareName = oldMIddleware.name;
              req.profilingStats = req.profilingStats || [];

              req.profilingStats.push({
                name: middlewareName,
                timeStarted: startDate,
                duration: duration
              });
              return next(err);
            });
          };
        }
      }

      return expressUse.apply(app, arguments);
    };
    return app;
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

})();

