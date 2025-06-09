import '@web-api/persistence/postgres/utils/mocks.jest';
import { tryGetLock as tryGetLockMock } from '@web-api/persistence/postgres/utils/operation/tryGetLock';
import { releaseLock as releaseLockMock } from '@web-api/persistence/postgres/utils/operation/releaseLock';
import { hashLockId } from '@web-api/persistence/postgres/utils/mutex';
import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { MOCK_PRACTITIONER } from '../../../../../shared/src/test/mockUsers';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import {
  determineEntitiesToLock,
  updatePractitionerUserInteractor,
} from './updatePractitionerUserInteractor';
import { mockAdmissionsClerkUser } from '@shared/test/mockAuthUsers';

const tryGetLock = jest.mocked(tryGetLockMock);
const releaseLock = jest.mocked(releaseLockMock);

describe('determineEntitiesToLock', () => {
  const mockPractitioner: RawPractitioner = MOCK_PRACTITIONER;
  let mockParams;
  beforeEach(() => {
    mockParams = {
      barNumber: 'pt101',
      user: mockPractitioner,
    };
    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByUser.mockReturnValue(['111-20', '222-20', '333-20']);
  });
  it('should lookup the docket numbers for the specified user', async () => {
    await determineEntitiesToLock(applicationContext, mockParams);
    expect(
      applicationContext.getPersistenceGateway().getDocketNumbersByUser,
    ).toHaveBeenCalledWith({
      applicationContext,
      userId: mockPractitioner.userId,
    });
  });
  it('should return an object that includes all of the docketNumbers associated with the user', async () => {
    const { identifiers } = await determineEntitiesToLock(
      applicationContext,
      mockParams,
    );

    expect(identifiers).toContain('case|111-20');
    expect(identifiers).toContain('case|222-20');
    expect(identifiers).toContain('case|333-20');
  });
});

describe('updatePractitionerUserInteractor', () => {
  const mockRequest = {
    barNumber: 'ab1234',
    bypassDocketEntry: false,
    user: MOCK_PRACTITIONER,
    clientConnectionId: 'TEST_CLIENT_CONNECTION_ID',
  };

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getPractitionerByBarNumber.mockReturnValue(MOCK_PRACTITIONER);

    applicationContext
      .getPersistenceGateway()
      .updatePractitionerUser.mockImplementation(({ user }) => user);
  });

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByUser.mockReturnValue([MOCK_CASE.docketNumber]);
  });

  describe('locked', () => {
    it('should throw a ServiceUnavailableError if a Case is currently locked', async () => {
      tryGetLock.mockResolvedValueOnce(false);

      await expect(
        updatePractitionerUserInteractor(
          applicationContext,
          mockRequest,
          mockAdmissionsClerkUser,
        ),
      ).rejects.toThrow(ServiceUnavailableError);

      expect(
        applicationContext.getPersistenceGateway().getCaseByDocketNumber,
      ).not.toHaveBeenCalled();
    });
  });

  describe('not locked', () => {
    it('should acquire and release a lock', async () => {
      await updatePractitionerUserInteractor(
        applicationContext,
        mockRequest,
        mockAdmissionsClerkUser,
      );

      expect(tryGetLock.mock.calls[0][1]).toEqual(
        hashLockId(`case|${MOCK_CASE.docketNumber}`),
      );

      expect(releaseLock.mock.calls[0][1]).toEqual(
        hashLockId(`case|${MOCK_CASE.docketNumber}`),
      );
    });
  });
});
