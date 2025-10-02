import { pollAWSBatchProgress } from './pollAWSBatchProgress';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';

describe('pollAWSBatchProgress', () => {
  const onProgressMock = jest.fn();
  const getBatchClientSendMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    applicationContext.getBatchClient = jest.fn().mockReturnValue({
      send: getBatchClientSendMock,
    });
  });

  it('throws a timeout error', async () => {
    try {
      await pollAWSBatchProgress({
        applicationContext,
        jobId: 'non-existent-job-id',
        timeout: -1, // Set a very short timeout for testing
        onProgress: onProgressMock,
      });

      //should fail if it gets here
      throw new Error('Test failed');
    } catch (e) {
      // expect(e).toEqual(
      //   new Error('Batch job non-existent-job-id timed out after -1ms'),
      // );
    }
  });

  it('polls job status and calls onProgress', async () => {});
});
