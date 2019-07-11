const {
  InvalidEntityError,
  NotFoundError,
  UnauthorizedError,
  UnknownUserError,
  UnprocessableEntityError,
} = require('./errors');

describe('NotFoundError', () => {
  let error;

  beforeEach(() => {
    error = new NotFoundError('some error');
  });

  it('should set a status code of 404', () => {
    expect(error.statusCode).toEqual(404);
  });

  it('should set the message', () => {
    expect(error.message).toEqual('some error');
  });
});

describe('UnauthorizedError', () => {
  let error;

  beforeEach(() => {
    error = new UnauthorizedError('some error');
  });

  it('should set a status code of 403', () => {
    expect(error.statusCode).toEqual(403);
  });

  it('should set the message', () => {
    expect(error.message).toEqual('some error');
  });
});

describe('UnknownUserError', () => {
  let error;

  beforeEach(() => {
    error = new UnknownUserError('some error');
  });

  it('should set a status code of 401', () => {
    expect(error.statusCode).toEqual(401);
  });

  it('should set the message', () => {
    expect(error.message).toEqual('some error');
  });
});

describe('UnprocessableEntityError', () => {
  let error;

  beforeEach(() => {
    error = new UnprocessableEntityError();
  });

  it('should set a status code of 422', () => {
    expect(error.statusCode).toEqual(422);
  });

  it('should set the message', () => {
    expect(error.message).toEqual('cannot process');
  });
});

describe('InvalidEntityError', () => {
  let error;

  beforeEach(() => {
    error = new InvalidEntityError();
  });

  it('should set a status code of 422', () => {
    expect(error.statusCode).toEqual(422);
  });

  it('should set the message', () => {
    expect(error.message).toEqual('entity is invalid or invalid for operation');
  });
});
