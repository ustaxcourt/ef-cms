import '@web-api/persistence/postgres/utils/mocks.jest';
jest.mock('@web-api/persistence/postgres/users/getDocketNumbersByUser');
jest.mock('@web-api/persistence/postgres/users/getPractitionerByBarNumber');
import { tryGetLocks as tryGetLocksMock } from '@web-api/persistence/postgres/utils/operation/tryGetLocks';
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
import { getDocketNumbersByUser as getDocketNumbersByUserMock } from '@web-api/persistence/postgres/users/getDocketNumbersByUser';
import { getPractitionerByBarNumber as getPractitionerByBarNumberMock } from '@web-api/persistence/postgres/users/getPractitionerByBarNumber';

const tryGetLocks = jest.mocked(tryGetLocksMock);

describe('determineEntitiesToLock', () => {
  const mockPractitioner: RawPractitioner = MOCK_PRACTITIONER;
  const getDocketNumbersByUser = jest.mocked(getDocketNumbersByUserMock);
  let mockParams;
  beforeEach(() => {
    mockParams = {
      barNumber: 'pt101',
      user: mockPractitioner,
    };
    getDocketNumbersByUser.mockResolvedValue(['111-20', '222-20', '333-20']);
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

  describe('updatePractitionerUserInteractor', () => {
    const mockRequest = {
      barNumber: 'ab1234',
      bypassDocketEntry: false,
      user: MOCK_PRACTITIONER,
      clientConnectionId: 'TEST_CLIENT_CONNECTION_ID',
    };
    const getPractitionerByBarNumber = jest.mocked(
      getPractitionerByBarNumberMock,
    );

    beforeAll(() => {
      getPractitionerByBarNumber.mockResolvedValue(MOCK_PRACTITIONER);

      applicationContext
        .getPersistenceGateway()
        .updatePractitionerUser.mockImplementation(({ user }) => user);
    });

    beforeEach(() => {
      getDocketNumbersByUser.mockResolvedValue([MOCK_CASE.docketNumber]);
    });

    describe('locked', () => {
      it('should throw a ServiceUnavailableError if a Case is currently locked', async () => {
        tryGetLocks.mockResolvedValueOnce([
          { successfullyLocked: false, identifier: 'abc' },
        ]);

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

        expect(tryGetLocks).toHaveBeenCalledWith(
          expect.objectContaining({
            identifiers: [`case|${MOCK_CASE.docketNumber}`],
          }),
        );
      });
    });
  });
});
