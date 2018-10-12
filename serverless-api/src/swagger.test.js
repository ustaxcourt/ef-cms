'use strict';

const lambdaTester = require('lambda-tester');
const expect = require('chai').expect;
const chai = require('chai');
chai.use(require('chai-string'));

const swagger = require('./swagger');


describe.only('swagger GET', function() {
  it('should GET and return a 200 status', function() {
    return lambdaTester(swagger.handler)
      .event({httpMethod: 'GET'})
      .expectResult((result) => {
        expect(result.statusCode).to.equal(200);
      })
  });

});

