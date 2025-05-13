import '@web-api/persistence/postgres/practitioners/mocks.jest';
import '@web-api/persistence/postgres/users/mocks.jest';
import { MOCK_CASE } from '@shared/test/mockCase';
import { MOCK_LOCK } from '@shared/test/mockLock';
import { MOCK_PRACTITIONER } from '@shared/test/mockUsers';
import {
  Practitioner,
  RawPractitioner,
} from '@shared/business/entities/Practitioner';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import {
  determineEntitiesToLock,
  updatePractitionerUserInteractor,
} from './updatePractitionerUserInteractor';
import { mockAdmissionsClerkUser } from '@shared/test/mockAuthUsers';
import { getPractitionerByBarNumber as getPractitionerByBarNumberMock } from '@web-api/persistence/postgres/practitioners/getPractitionerByBarNumber';
import { updatePractitionerUser as updatePractitionerUserMock } from '@web-api/persistence/postgres/practitioners/updatePractitionerUser';
import { getDocketNumbersByUser as getDocketNumbersByUserMock } from '@web-api/persistence/postgres/users/cases/getCasesForUser';

const getPractitionerByBarNumber = getPractitionerByBarNumberMock as jest.Mock;
const updatePractitionerUser = updatePractitionerUserMock as jest.Mock;
const getDocketNumbersByUser = getDocketNumbersByUserMock as jest.Mock;

describe('determineEntitiesToLock', () => {
  const mockPractitioner: RawPractitioner = MOCK_PRACTITIONER;
  let mockParams;
  beforeEach(() => {
    mockParams = {
      barNumber: 'pt101',
      user: mockPractitioner,
    };
    getDocketNumbersByUser.mockReturnValue(['111-20', '222-20', '333-20']);
  });
  it('should lookup the docket numbers for the specified user', async () => {
    await determineEntitiesToLock(applicationContext, mockParams);
    expect(getDocketNumbersByUser).toHaveBeenCalledWith({
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
  let mockLock;
  const mockRequest = {
    barNumber: 'ab1234',
    bypassDocketEntry: false,
    user: MOCK_PRACTITIONER,
    clientConnectionId: 'TEST_CLIENT_CONNECTION_ID',
  };

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);

    getPractitionerByBarNumber.mockReturnValue(
      new Practitioner(MOCK_PRACTITIONER),
    );

    updatePractitionerUser.mockImplementation(({ user }) => user);
  });

  beforeEach(() => {
    mockLock = undefined; // unlocked

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);

    getDocketNumbersByUser.mockReturnValue([MOCK_CASE.docketNumber]);
  });

  describe('locked', () => {
    beforeEach(() => {
      mockLock = MOCK_LOCK;
    });

    it('should throw a ServiceUnavailableError if a Case is currently locked', async () => {
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
    beforeEach(() => {
      mockLock = undefined;
    });

    it('should acquire a lock that lasts for 15 minutes', async () => {
      await updatePractitionerUserInteractor(
        applicationContext,
        mockRequest,
        mockAdmissionsClerkUser,
      );

      expect(
        applicationContext.getPersistenceGateway().createLock,
      ).toHaveBeenCalledWith({
        applicationContext,
        identifier: `case|${MOCK_CASE.docketNumber}`,
        ttl: 900,
      });
    });
    it('should remove the lock', async () => {
      await updatePractitionerUserInteractor(
        applicationContext,
        mockRequest,
        mockAdmissionsClerkUser,
      );

      expect(
        applicationContext.getPersistenceGateway().removeLock,
      ).toHaveBeenCalledWith({
        applicationContext,
        identifiers: [`case|${MOCK_CASE.docketNumber}`],
      });
    });
  });
});
