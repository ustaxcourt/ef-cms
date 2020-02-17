const {
  NotFoundError,
  UnauthorizedError,
} = require('../../shared/src/errors/errors');
const { customHandle } = require('./customHandle');

jest.mock('./middleware/apiGatewayHelper');
const { sendError, sendOk } = require('./middleware/apiGatewayHelper');

let fn = async () => Promise.resolve('okay');
const errNotFound = async () => {
  throw new NotFoundError('oh no');
};
const errUnauthorized = async () => {
  throw new UnauthorizedError('oh no');
};
const otherError = async () => {
  throw new Error('oh no');
};

describe('customHandle', () => {
  beforeEach(() => {
    sendOk.mockImplementation(e => e);
    sendError.mockImplementation(e => e);
  });
  afterEach(() => {
    sendOk.mockRestore();
    sendError.mockRestore();
  });
  it('returns OK if lambda warm-up is event source', async () => {
    await customHandle({ source: 'serverless-plugin-warmup' }, otherError);
    expect(sendOk).toHaveBeenCalled();
  });

  it('returns pdfBuffers on success', async () => {
    const result = await customHandle({ source: 'test' }, fn);
    expect(result.headers['Content-Type']).toBe('application/pdf');
    expect(sendError).not.toHaveBeenCalled();
  });
  it('returns pdfBuffers on success with no value returned from fn', async () => {
    fn = async () => Promise.resolve();
    const result = await customHandle({ source: 'test' }, fn);
    expect(result.headers['Content-Type']).toBe('application/pdf');
    expect(sendError).not.toHaveBeenCalled();
  });

  it('rejects "not found" with 404', async () => {
    const result = await customHandle({}, errNotFound);
    expect(result.statusCode).toBe(404);
  });
  it('rejects "not authorized" with 403', async () => {
    const result = await customHandle({}, errUnauthorized);
    expect(result.statusCode).toBe(403);
  });
  it('rejects other errors', async () => {
    await customHandle({}, otherError);
    expect(sendError).toHaveBeenCalled();
  });
});
