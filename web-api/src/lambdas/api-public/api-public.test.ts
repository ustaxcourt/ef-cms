jest.mock('@codegenie/serverless-express', () => jest.fn());
jest.mock('../../app-public', () => ({
  app: { name: 'public-app' },
}));

import { app } from '../../app-public';
import awsServerlessExpress from '@codegenie/serverless-express';
import { handler } from './api-public';

describe('api-public lambda handler', () => {
  const mockAwsServerlessExpress = awsServerlessExpress as jest.Mock;

  beforeEach(() => {
    mockAwsServerlessExpress.mockReset();
  });

  it('forwards event, context, and callback to serverless-express', async () => {
    const mockConfiguredHandler = jest.fn();
    const event = {
      path: '/public-api/ping',
    };
    const context = { functionName: 'api-public-handler' };
    const callback = jest.fn();

    mockAwsServerlessExpress.mockReturnValue(mockConfiguredHandler);

    await handler(event, context, callback);

    expect(mockAwsServerlessExpress).toHaveBeenCalledWith({ app });
    expect(mockConfiguredHandler).toHaveBeenCalledWith(
      event,
      context,
      callback,
    );
  });
});
