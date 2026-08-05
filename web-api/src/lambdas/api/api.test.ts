jest.mock('@codegenie/serverless-express', () => jest.fn());
jest.mock('../../app', () => ({
  app: { name: 'private-app' },
}));

import { app } from '../../app';
import awsServerlessExpress from '@codegenie/serverless-express';
import { handler } from './api';

describe('api lambda handler', () => {
  const mockAwsServerlessExpress = awsServerlessExpress as jest.Mock;

  beforeEach(() => {
    mockAwsServerlessExpress.mockReset();
  });

  it('normalizes auth paths, stringifies object bodies, and forwards callback to serverless-express', async () => {
    const mockConfiguredHandler = jest.fn();
    const event = {
      body: { docketNumber: '123-45' },
      path: '/auth/login',
      pathParameters: { proxy: 'login' },
    };
    const context = { functionName: 'api-handler' };
    const callback = jest.fn();

    mockAwsServerlessExpress.mockReturnValue(mockConfiguredHandler);

    await handler(event, context, callback);

    expect(event.pathParameters.proxy).toBe('auth/login');
    expect(event.body).toBe(JSON.stringify({ docketNumber: '123-45' }));
    expect(mockAwsServerlessExpress).toHaveBeenCalledWith({ app });
    expect(mockConfiguredHandler).toHaveBeenCalledWith(
      event,
      context,
      callback,
    );
  });

  it('normalizes system paths and preserves string bodies', async () => {
    const mockConfiguredHandler = jest.fn();
    const event = {
      body: '{"already":"string"}',
      path: '/system/health',
      pathParameters: { proxy: 'health' },
    };

    mockAwsServerlessExpress.mockReturnValue(mockConfiguredHandler);

    await handler(event, {}, jest.fn());

    expect(event.pathParameters.proxy).toBe('system/health');
    expect(event.body).toBe('{"already":"string"}');
  });
});
