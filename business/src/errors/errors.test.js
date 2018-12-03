const expect = require('chai').expect;

const chai = require('chai');
chai.use(require('chai-string'));

const {
  NotFoundError,
  UnauthorizedError,
  UnprocessableEntityError,
  InvalidEntityError,
} = require('./errors');

describe('NotFoundError', () => {
  let error;

  beforeEach(() => {
    error = new NotFoundError('some error');
  });

  it('should set a status code of 404', () => {
    expect(error.statusCode).to.equal(404);
  });

  it('should set the message', () => {
    expect(error.message).to.equal('some error');
  });
});

describe('UnauthorizedError', () => {
  let error;

  beforeEach(() => {
    error = new UnauthorizedError('some error');
  });

  it('should set a status code of 403', () => {
    expect(error.statusCode).to.equal(403);
  });

  it('should set the message', () => {
    expect(error.message).to.equal('some error');
  });
});

describe('UnprocessableEntityError', () => {
  let error;

  beforeEach(() => {
    error = new UnprocessableEntityError();
  });

  it('should set a status code of 422', () => {
    expect(error.statusCode).to.equal(422);
  });

  it('should set the message', () => {
    expect(error.message).to.equal('problem in body or url');
  });
});

describe('InvalidEntityError', () => {
  let error;

  beforeEach(() => {
    error = new InvalidEntityError();
  });

  it('should set a status code of 422', () => {
    expect(error.statusCode).to.equal(422);
  });

  it('should set the message', () => {
    expect(error.message).to.equal('entity is invalid or invalid for operation');
  });
});

