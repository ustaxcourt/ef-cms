const {
  InvalidEntityError,
  NotFoundError,
  UnauthorizedError,
  UnknownUserError,
  UnprocessableEntityError,
  UnsanitizedEntityError,
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
  it('should set the message which includes the entityName and failing ids', () => {
    const error = new InvalidEntityError('TestEntity', 123, 'Test message');
    expect(error.message).toEqual(
      'The TestEntity entity was invalid. Test message. 123',
    );
  });

  it('should set a default error message if one is not passed in', () => {
    const error = new InvalidEntityError('TestEntity', 123);
    expect(error.message).toEqual(
      'The TestEntity entity was invalid. entity is invalid or invalid for operation. 123',
    );
  });
});

describe('UnsanitizedEntityError', () => {
  let error;

  beforeEach(() => {
    error = new UnsanitizedEntityError();
  });

  it('should set a status code of 500', () => {
    expect(error.statusCode).toEqual(500);
  });

  it('should set the message', () => {
    expect(error.message).toEqual('Unsanitized entity');
  });
});
