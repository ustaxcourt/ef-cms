'use strict';

const hello = require('./hello.js');
const lambdaTester = require('lambda-tester');
const chai = require('chai');
const expect = require('chai').expect;

chai.use(require('chai-string'));

describe('hello GET', function() {
  it('should GET and return a 200 status', function() {
    return lambdaTester(hello.handler)
    .event({httpMethod: 'GET'})
    .expectResult(result => {
      expect(result.statusCode).to.equal('200');
    })
  });

  it('should GET a hello world body', function() {
    return lambdaTester(hello.handler)
    .event({httpMethod: 'GET'})
    .expectResult(result => {
      expect(result.body).to.equal('"Hello World"');
    })
  });

});
