import ErrorFactory from './ErrorFactory';

describe('ErrorFactory', () => {
  it('creates unauthorized errors for status code 401', () => {
    const error = new Error();
    error.response = { data: 'Unauthorized', status: 401 };
    const result = ErrorFactory.getError(error);
    expect(result.name).toEqual('CerebralError');
    expect(result.title).toEqual('We cannot find the page you requested');
  });
  it('creates unauthorized errors for status code 403', () => {
    const error = new Error();
    error.response = { data: 'Unauthorized', status: 403 };
    const result = ErrorFactory.getError(error);
    expect(result.name).toEqual('CerebralError');
    expect(result.title).toEqual('We cannot find the page you requested');
  });
  it('creates unauthorized errors for status code 404', () => {
    const error = new Error();
    error.response = { data: 'Unauthorized', status: 404 };
    const result = ErrorFactory.getError(error);
    expect(result.name).toEqual('CerebralError');
    expect(result.title).toEqual('We cannot find the page you requested');
  });
  it('creates invalidrequest errors for status code 400', () => {
    const error = new Error();
    error.response = { data: 'Unauthorized', status: 400 };
    const result = ErrorFactory.getError(error);
    expect(result.name).toEqual('CerebralError');
    expect(result.title).toEqual('An unexpected error has occurred');
  });
  it('creates invalidrequest errors for status code 500', () => {
    const error = new Error();
    error.response = { data: 'message', status: 500 };
    const result = ErrorFactory.getError(error);
    expect(result.name).toEqual('CerebralError');
    expect(result.title).toEqual('An error has occurred');
  });
  it('creates actionerror errors for other status codes', () => {
    const error = new Error();
    error.response = { data: 'message', status: 418 };
    const result = ErrorFactory.getError(error);
    expect(result.name).toEqual('CerebralError');
    expect(result.title).toEqual('An unexpected error has occurred');
  });
});
