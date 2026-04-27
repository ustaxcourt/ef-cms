jest.mock('@web-api/gateways/lambda/getLambdaClient', () => ({
  getLambdaClient: jest.fn(),
}));

import { InvokeCommand } from '@aws-sdk/client-lambda';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getLambdaClient } from '@web-api/gateways/lambda/getLambdaClient';
import { reinvoke } from '@web-api/dispatchers/lambda/reinvoke';

describe('reinvoke', () => {
  const mockSend = jest.fn();

  beforeEach(() => {
    (getLambdaClient as jest.Mock).mockReturnValue({ send: mockSend });
  });

  it('should invoke the named lambda asynchronously with the original event as payload', async () => {
    const originalEvent = { Records: [{ data: 'something' }] };

    await reinvoke(applicationContext, {
      functionName: 'my_function_dev_blue',
      originalEvent,
    });

    expect(mockSend).toHaveBeenCalledTimes(1);
    const command = mockSend.mock.calls[0][0] as InvokeCommand;
    expect(command).toBeInstanceOf(InvokeCommand);
    expect(command.input.FunctionName).toEqual('my_function_dev_blue');
    expect(command.input.InvocationType).toEqual('Event');
    expect(
      JSON.parse(Buffer.from(command.input.Payload as Uint8Array).toString()),
    ).toEqual(originalEvent);
  });

  it('should log that the lambda is being retried', async () => {
    await reinvoke(applicationContext, {
      functionName: 'my_function_dev_blue',
      originalEvent: {},
    });

    expect(applicationContext.logger.info).toHaveBeenCalledWith(
      'Retrying Lambda: my_function_dev_blue',
    );
  });
});
