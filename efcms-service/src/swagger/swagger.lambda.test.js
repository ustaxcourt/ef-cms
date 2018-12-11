const lambdaTester = require('lambda-tester');
const chai = require('chai');
const expect = require('chai').expect;

chai.use(require('chai-string'));

const swagger = require('./swagger.lambda');

describe('swagger GET', function() {
  it('should GET and return a 200 status', function() {
    return lambdaTester(swagger.handler)
      .event({httpMethod: 'GET'})
      .expectResolve(result => {
        expect(result.statusCode).to.equal('200');
      })
  });

  it('should GET and return a html body for swagger', function() {
    return lambdaTester(swagger.handler)
      .event({httpMethod: 'GET'})
      .expectResolve(result => {
        expect(result.body).to.startsWith('<html>');
      })
  });

});
