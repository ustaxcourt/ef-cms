'use strict';

const trivia = require('./trivia.js');
const lambdaTester = require('lambda-tester');
const chai = require('chai');
const expect = require('chai').expect;

chai.use(require('chai-string'));

describe('trivia GET', function() {
  it('should GET and return a 200 status', function() {
    return lambdaTester(trivia.handler)
    .event({httpMethod: 'GET'})
    .expectResult((result) => {
      expect(result.statusCode).to.equal('200');
    })
  });

  it('should GET a date body', function() {
    return lambdaTester(trivia.handler)
    .event({httpMethod: 'GET'})
    .expectResult((result) => {
      expect(result.body).to.startsWith('"\\"Today is');
    })
  });

});