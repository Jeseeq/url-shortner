/*jslint node: true */
/*global describe: false, before: false, after: false, it: false */
"use strict";

var expect = require('chai').expect,
    request = require('request'),
    server = require('../index'),
    redis = require('redis'),
    client;

client = redis.createClient();

describe('server', function () {

  before(function (done) {
    console.log('Starting server');
    done();
  });

  after(function (done) {
    console.log('Stopping server');
    client.flushdb();
    done();
  });

  describe('Test the index route', function () {
    it('should return a page with title Shorty', function (done) {
      request.get({url : 'http://localhost:5000'}, function (error, res, body) {
        expect(body).to.include('Shorty');
        expect(res.statusCode).to.equal(200);
        expect(res.headers['content-type']).to.equal('text/html; charset=utf-8');
        done();
      });
    });

  });

  describe('Test submiting url', function () {
    it('should return shortened URL', function (done) {
      request.post('http://localhost:5000', {form :{url: 'http://google.com.ua'}}, function (error, res, body ) {
        expect(body).to.include('Your short URL is');
        expect(res.statusCode).to.equal(200);
        expect(res.headers['content-type']).to.equal('text/html; charset=utf-8');
        done();
      });
    });
  });

  describe('Test following a URL', function () {
    it('should redirect user to shortened URL', function (done) {
      client.set('testurl', 'http://www.google.com', function () {
        request.get({
          url:'http://localhost:5000/testurl',
          followRedirect: false
        }, function (error, res, body) {
          expect(res.headers.location).to.equal('http://www.google.com');
          expect(res.statusCode).to.equal(301);
          done();
        });
      });
    });
  });

  describe('Test following non existing link', function () {
    it('should return 404 error', function (done) {
      request.get({
        url: 'http://localhost:5000/nonexistingurl',
        followRedirect: false
      }, function (error, res, body) {
        expect(res.statusCode).to.equal(404);
        expect(body).to.include('Link not found');
        done();
      });
    });
  });

});
