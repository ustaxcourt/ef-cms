import { MESSAGE_TYPES } from '@web-api/gateways/worker/workerRouter';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { rescheduleLambda } from '@web-api/dispatchers/sqs/rescheduleLambda';

describe('rescheduleLambda', () => {
  const ORIGINAL_FN_NAME = process.env.AWS_LAMBDA_FUNCTION_NAME;

  beforeEach(() => {
    process.env.AWS_LAMBDA_FUNCTION_NAME = 'some_lambda_name';
  });

  afterAll(() => {
    process.env.AWS_LAMBDA_FUNCTION_NAME = ORIGINAL_FN_NAME;
  });

  it('should enqueue a RESCHEDULE_LAMBDA message carrying the current function name and original event', async () => {
    const event = { foo: 'bar' };

    await rescheduleLambda(applicationContext, { event });

    const queueWorkCalls = (
      applicationContext.getWorkerGateway().queueWork as jest.Mock
    ).mock.calls;

    expect(queueWorkCalls).toHaveLength(1);
    const [, { message }] = queueWorkCalls[0];
    expect(message.type).toEqual(MESSAGE_TYPES.RESCHEDULE_LAMBDA);
    expect(message.payload.functionName).toEqual('some_lambda_name');
    expect(message.payload.originalEvent).toEqual(event);
  });

  it('should use a default delay of 30 seconds when not provided', async () => {
    await rescheduleLambda(applicationContext, { event: {} });

    const { message } = (
      applicationContext.getWorkerGateway().queueWork as jest.Mock
    ).mock.calls[0][1];
    expect(message.delay).toEqual(30);
  });

  it('should honor a custom delay when provided', async () => {
    await rescheduleLambda(applicationContext, { event: {} }, 180);

    const { message } = (
      applicationContext.getWorkerGateway().queueWork as jest.Mock
    ).mock.calls[0][1];
    expect(message.delay).toEqual(180);
  });

  it('should include an automated-system authorized user', async () => {
    await rescheduleLambda(applicationContext, { event: {} });

    const { message } = (
      applicationContext.getWorkerGateway().queueWork as jest.Mock
    ).mock.calls[0][1];
    expect(message.authorizedUser).toEqual({
      email: 'system@ustc.gov',
      name: 'ustc automated system',
      role: 'docketclerk',
      userId: 'N/A',
    });
  });
});
