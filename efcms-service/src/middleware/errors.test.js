const expect = require('chai').expect;

const chai = require('chai');
chai.use(require('chai-string'));

const { NotFoundError, UnauthorizedError } = require('./errors');

describe('NotFoundError', () => {
  let error;

  beforeEach(() => {
    error = new NotFoundError("some error");
  });

  it('should set a status code of 404', () => {
    expect(error.statusCode).to.equal(404);
  });

  it('should set the message', () => {
    expect(error.message).to.equal("some error");
  });
});

describe('UnauthorizedError', () => {
  let error;

  beforeEach(() => {
    error = new UnauthorizedError("some error");
  });

  it('should set a status code of 404', () => {
    expect(error.statusCode).to.equal(404);
  });

  it('should set the message', () => {
    expect(error.message).to.equal("some error");
  });
});