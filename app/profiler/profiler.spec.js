'use strict';

var request = require('supertest');
var should  = require('should');
var express = require('express');

var app = express();

var profiler = require('./profiler');
var stats = {};

profiler.startProfiling(app);
function middlewareToTest (req, res, next) {
  setTimeout(function() {
    next();
  }, 1000);
}

function middlewareToTest2 (req, res, next) {
  setTimeout(function() {
    next();
  }, 1000);
}

function errorHandler (err, req, res, next) {
  if (err) {
    res.sendStatus(500);
  }
}

app.use(middlewareToTest, middlewareToTest2);

app.use(profiler.recordStats(function(reqStats) {
  stats = reqStats;
}));

app.get('/', function (req, res) {
  res.sendStatus(200);
});

app.get('/error', function (req, res, next) {
  var error = new Error('error');
  return next(error);
});

app.use(errorHandler);

describe('Profiler moduler', function() {
  it('should get metrics for 2 middleware functions', function(done) {
    request(app)
      .get('/')
      .expect(200)
      .end(function(err, res) {
        stats.length.should.eql(3);
        stats[0].name.should.eql('middlewareToTest');
        done();
      });
  });

  it('should invoke errorHandler properly and result in 500 error status', function(done) {
    
    request(app)
      .get('/error')
      .expect(500)
      .end(function(err, res) {
        done();
      });
  });
});
