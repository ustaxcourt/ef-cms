import {
  InvalidEntityError,
  NotFoundError,
  ServiceUnavailableError,
  UnauthorizedError,
  UnknownUserError,
  UnprocessableEntityError,
  UnsanitizedEntityError,
} from './errors';

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
  it('should set the message which includes the entityName, error string, and error object', () => {
    const error = new InvalidEntityError('TestEntity', 'Test message', {
      someObject: 'yep',
    });
    expect(error.message).toEqual(
      'The TestEntity entity was invalid. Test message',
    );
    expect(error.details).toEqual({ someObject: 'yep' });
  });

  it('should set the message which includes the entityName and default messages', () => {
    const error = new InvalidEntityError('TestEntity', undefined, {
      foo: true,
    });
    expect(error.message).toEqual(
      'The TestEntity entity was invalid. entity is invalid or invalid for operation',
    );
    expect(error.details!.foo).toBe(true);
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

describe('ServiceUnavailableError', () => {
  let error;

  beforeEach(() => {
    error = new ServiceUnavailableError();
  });

  it('should set a status code of 503', () => {
    expect(error.statusCode).toEqual(503);
  });

  it('should set the message', () => {
    expect(error.message).toEqual('Service Unavailable');
  });
});
