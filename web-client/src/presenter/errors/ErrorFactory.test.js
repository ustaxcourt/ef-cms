import { ErrorFactory } from './ErrorFactory';

describe('ErrorFactory', () => {
  it('creates UnidentifiedUserError errors for status code 401', () => {
    const error = new Error();
    error.response = { data: 'foo', status: 401 };
    const result = ErrorFactory.getError(error);
    expect(result.className).toEqual('UnidentifiedUserError');
    expect(result.title).toEqual('You are not logged in');
  });
  it('creates UnauthorizedRequestError errors for status code 403', () => {
    const error = new Error();
    error.response = { data: 'foo', status: 403 };
    const result = ErrorFactory.getError(error);
    expect(result.className).toEqual('UnauthorizedRequestError');
    expect(result.title).toEqual('We cannot find the page you requested');
  });
  it('creates UnauthorizedRequestError errors for status code 404', () => {
    const error = new Error();
    error.response = { data: 'foo', status: 404 };
    const result = ErrorFactory.getError(error);
    expect(result.className).toEqual('NotFoundError');
    expect(result.title).toEqual('We cannot find the page you requested');
  });
  it('creates UnauthorizedRequestError errors for status code 404 and a message', () => {
    const error = new Error();
    error.response = { message: 'foo', status: 404 };
    const result = ErrorFactory.getError(error);
    expect(result.className).toEqual('NotFoundError');
    expect(result.title).toEqual('We cannot find the page you requested');
  });
  it('creates InvalidRequestError errors for status code 400', () => {
    const error = new Error();
    error.response = { data: 'foo', status: 400 };
    const result = ErrorFactory.getError(error);
    expect(result.className).toEqual('InvalidRequestError');
    expect(result.title).toEqual('An unexpected error has occurred');
  });
  it('creates ServerInvalidResponseError errors for status code 500', () => {
    const error = new Error();
    error.response = { data: 'foo', status: 500 };
    const result = ErrorFactory.getError(error);
    expect(result.className).toEqual('ServerInvalidResponseError');
    expect(result.title).toEqual('An error has occurred');
  });
  it('creates GatewayTimeoutError errors for status code 504', () => {
    const error = new Error();
    error.response = { data: 'foo', status: 504 };
    const result = ErrorFactory.getError(error);
    expect(result.className).toEqual('GatewayTimeoutError');
    expect(result.title).toEqual('The system is taking too long to respond');
  });
  it('creates InvalidRequestError errors for other 4XX status codes', () => {
    const error = new Error();
    error.response = { data: 'foo', status: 418 };
    const result = ErrorFactory.getError(error);
    expect(result.className).toEqual('InvalidRequestError');
    expect(result.title).toEqual('An unexpected error has occurred');
  });
  it('creates ActionError errors for any other responses with status code', () => {
    const error = new Error();
    error.response = {
      data: 'foo',
      status: 206,
    };
    const result = ErrorFactory.getError(error);
    expect(result.className).toEqual('ActionError');
    expect(result.title).toEqual('An error occurred');
  });
  it('creates ActionError errors for responses without status code', () => {
    const error = new Error();
    error.response = {
      data: 'foo',
    };
    const result = ErrorFactory.getError(error);
    expect(result.className).toEqual('ActionError');
    expect(result.title).toEqual('An error occurred');
  });

  it('creates UnidentifiedUserError errors for null responses (when cors error happen in cognito)', () => {
    const error = new Error();
    error.response = null;
    const result = ErrorFactory.getError(error);
    expect(result.className).toEqual('UnidentifiedUserError');
    expect(result.title).toEqual('You are not logged in');
  });
  it('creates ActionError errors for unusually constructed Errors', () => {
    const error = new Error('something completely different');
    error.response = {};
    const result = ErrorFactory.getError(error);
    expect(result.className).toEqual('ActionError');
    expect(result.title).toEqual('An error occurred');
  });
});
