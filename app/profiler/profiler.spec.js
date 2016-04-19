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

app.use(middlewareToTest);
app.use(middlewareToTest);
app.use(profiler.recordStats(function(reqStats) {
  stats = reqStats;
}));

app.get('/', function (req, res) {
  res.sendStatus(200);
});

describe('Profiler moduler', function() {
  it('should get metrics for 2 middleware functions', function(done) {
    
    request(app)
      .get('/')
      .expect(200)
      .end(function(err, res) {
        stats.length.should.eql(2);
        stats[0].name.should.eql('middlewareToTest');
        done();
      });
  });
});
