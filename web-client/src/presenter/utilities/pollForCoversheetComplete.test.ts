import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import {
  CoversheetGenerationError,
  CoversheetPollTimeoutError,
  pollForCoversheetComplete,
} from './pollForCoversheetComplete';

describe('pollForCoversheetComplete', () => {
  const getStatus = applicationContext.getUseCases()
    .getDocketEntryProcessingStatusInteractor as jest.Mock;
  const sleep = applicationContext.getUtilities().sleep as jest.Mock;

  beforeEach(() => {
    getStatus.mockReset();
    sleep.mockReset();
    sleep.mockResolvedValue(undefined);
  });

  it('resolves immediately when no docket entries are provided', async () => {
    await pollForCoversheetComplete({
      applicationContext,
      docketEntryIds: [],
      docketNumber: '101-25',
    });
    expect(getStatus).not.toHaveBeenCalled();
  });

  it('resolves once every entry reports a complete processing status', async () => {
    getStatus.mockResolvedValueOnce({ processingStatus: 'pending' });
    getStatus.mockResolvedValueOnce({ processingStatus: 'pending' });
    getStatus.mockResolvedValueOnce({ processingStatus: 'complete' });
    getStatus.mockResolvedValueOnce({ processingStatus: 'complete' });

    await pollForCoversheetComplete({
      applicationContext,
      docketEntryIds: ['a', 'b'],
      docketNumber: '101-25',
    });

    expect(getStatus).toHaveBeenCalledTimes(4);
  });

  it('drops completed entries from subsequent iterations', async () => {
    getStatus.mockResolvedValueOnce({ processingStatus: 'complete' });
    getStatus.mockResolvedValueOnce({ processingStatus: 'pending' });
    getStatus.mockResolvedValueOnce({ processingStatus: 'complete' });

    await pollForCoversheetComplete({
      applicationContext,
      docketEntryIds: ['a', 'b'],
      docketNumber: '101-25',
    });

    const calledIds = getStatus.mock.calls.map(c => c[1].docketEntryId);
    expect(calledIds.filter(id => id === 'a').length).toBe(1);
    expect(calledIds.filter(id => id === 'b').length).toBe(2);
  });

  it('throws CoversheetGenerationError when any entry reports the error_adding_coversheet status', async () => {
    getStatus.mockResolvedValueOnce({ processingStatus: 'pending' });
    getStatus.mockResolvedValueOnce({
      processingStatus: 'error_adding_coversheet',
    });

    await expect(
      pollForCoversheetComplete({
        applicationContext,
        docketEntryIds: ['a', 'b'],
        docketNumber: '101-25',
      }),
    ).rejects.toBeInstanceOf(CoversheetGenerationError);
  });

  it('does not sleep before the first status check, so a worker that already finished is observed without an initial dead-time wait', async () => {
    getStatus.mockResolvedValueOnce({ processingStatus: 'complete' });

    await pollForCoversheetComplete({
      applicationContext,
      docketEntryIds: ['a'],
      docketNumber: '101-25',
    });

    expect(getStatus).toHaveBeenCalledTimes(1);
    expect(sleep).not.toHaveBeenCalled();
  });

  it('treats a transient status-check rejection as still-pending and continues polling', async () => {
    getStatus.mockRejectedValueOnce(new Error('5xx'));
    getStatus.mockResolvedValueOnce({ processingStatus: 'complete' });
    getStatus.mockResolvedValueOnce({ processingStatus: 'complete' });

    await pollForCoversheetComplete({
      applicationContext,
      docketEntryIds: ['a', 'b'],
      docketNumber: '101-25',
    });

    // First iteration: 1 reject + 1 fulfilled (complete). Second iteration:
    // the rejected entry is checked again, completes. The successful one
    // from iteration 1 is dropped.
    expect(getStatus).toHaveBeenCalledTimes(3);
  });

  it('throws CoversheetPollTimeoutError with the pending ids when the deadline elapses', async () => {
    getStatus.mockResolvedValue({ processingStatus: 'pending' });

    const nowSpy = jest.spyOn(Date, 'now');
    nowSpy.mockReturnValueOnce(0);
    nowSpy.mockReturnValue(2000);

    await expect(
      pollForCoversheetComplete({
        applicationContext,
        docketEntryIds: ['a', 'b'],
        docketNumber: '101-25',
        expirationSeconds: 1,
      }),
    ).rejects.toBeInstanceOf(CoversheetPollTimeoutError);

    nowSpy.mockRestore();
  });
});
