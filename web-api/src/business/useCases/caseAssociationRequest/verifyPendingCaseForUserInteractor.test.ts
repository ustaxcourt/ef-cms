import '@web-api/persistence/postgres/cases/mocks.jest';
import { verifyPendingCaseForUserInteractor } from './verifyPendingCaseForUserInteractor';
import { verifyPendingCaseForUser as verifyPendingCaseForUserMock } from '@web-api/persistence/postgres/cases/pendingCases/verifyPendingCaseForUser';

describe('verifyPendingCaseForUser', () => {
  const verifyPendingCaseForUser = jest.mocked(verifyPendingCaseForUserMock);
  it('should return results retrieved from persistence', async () => {
    const mockCaseRecord = {
      docketNumber: '123-19',
    };

    await verifyPendingCaseForUserInteractor({
      docketNumber: mockCaseRecord.docketNumber,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(verifyPendingCaseForUser).toHaveBeenCalled();
  });
});
