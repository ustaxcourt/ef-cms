import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import {
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
