import { MOCK_CASE } from '../../../test/mockCase';
import { applicationContext } from '../../test/createTestApplicationContext';
import { getCaseByDocketNumber } from './getCaseByDocketNumber';

const mockLock = {
  pk: `case|${MOCK_CASE.docketNumber}`,
  sk: 'lock|21af52db-508a-4962-a702-fa1aba9f8a37',
  ttl: 1680530219,
  user: 'Someone else',
};

describe('getCaseByDocketNumber', () => {
  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);
  });

  it('gets the case from persistence by the docketNumber', async () => {
    await getCaseByDocketNumber({
      applicationContext,
      docketNumber: MOCK_CASE.docketNumber,
    });
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalledWith({
      applicationContext,
      docketNumber: MOCK_CASE.docketNumber,
    });
  });

  it('returns the case it retrieved from persistence if acquireLock is false', async () => {
    const result = await getCaseByDocketNumber({
      acquireLock: false,
      applicationContext,
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(result).toMatchObject(MOCK_CASE);
  });

  it('returns the case it retrieved from persistence if acquireLock is not set', async () => {
    const result = await getCaseByDocketNumber({
      applicationContext,
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(result).toMatchObject(MOCK_CASE);
  });

  it('returns the case it retrieved from persistence if acquireLock is true and the case is not locked', async () => {
    const result = await getCaseByDocketNumber({
      acquireLock: true,
      applicationContext,
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(result).toMatchObject(MOCK_CASE);
  });

  it('acquires a lock on the case if acquireLock is true', async () => {
    await getCaseByDocketNumber({
      acquireLock: true,
      applicationContext,
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers().acquireLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      lockName: MOCK_CASE.docketNumber,
    });
  });

  it('throws an ServiceUnavailableError if acquireLock is true and the case is locked', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        lock: mockLock,
      });

    await expect(
      getCaseByDocketNumber({
        acquireLock: true,
        applicationContext,
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow();
  });
});
