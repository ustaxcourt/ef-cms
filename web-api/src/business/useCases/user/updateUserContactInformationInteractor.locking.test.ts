import '@web-api/persistence/postgres/featureFlag/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
jest.mock('@web-api/business/useCases/user/generateChangeOfAddress');
jest.mock('@web-api/business/useCases/user/generateChangeOfAddress');
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import {
  determineEntitiesToLock,
  updateUserContactInformationInteractor,
} from './updateUserContactInformationInteractor';
import { sleep } from '@shared/tools/helpers';
import { COUNTRY_TYPES } from '@shared/business/entities/EntityConstants';
import { MOCK_CASE } from '@shared/test/mockCase';
import { MOCK_PRACTITIONER } from '@shared/test/mockUsers';
import { tryGetLock as tryGetLockMock } from '@web-api/persistence/postgres/utils/operation/tryGetLock';
import { releaseLock as releaseLockMock } from '@web-api/persistence/postgres/utils/operation/releaseLock';
import { hashLockId } from '@web-api/persistence/postgres/utils/mutex';

const tryGetLock = jest.mocked(tryGetLockMock);
const releaseLock = jest.mocked(releaseLockMock);

const contactInfo = {
  address1: '234 Main St',
  address2: 'Apartment 4',
  address3: 'Under the stairs',
  city: 'Chicago',
  country: 'Brazil',
  countryType: COUNTRY_TYPES.INTERNATIONAL,
  phone: '+1 (555) 555-5555',
  postalCode: '61234',
  state: 'IL',
};

describe('determineEntitiesToLock', () => {
  let mockParams;
  const mockCases = ['111-20', '222-20', '333-20'].map(docketNumber => ({
    ...MOCK_CASE,
    docketNumber,
  }));
  beforeEach(() => {
    mockParams = {
      contactInfo,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    };
    applicationContext
      .getPersistenceGateway()
      .getCasesForUser.mockReturnValue(mockCases);

    applicationContext
      .getPersistenceGateway()
      .getUserByIdOnceAllUpdatesComplete.mockResolvedValue(null);
  });

  it('should lookup the docket numbers for the specified user', async () => {
    await determineEntitiesToLock(applicationContext, mockParams);
    expect(
      applicationContext.getPersistenceGateway().getCasesForUser,
    ).toHaveBeenCalledWith({
      applicationContext,
      userId: mockParams.userId,
    });
  });
  it('should return an object that includes all of the docketNumbers associated with the user', async () => {
    const { identifiers } = await determineEntitiesToLock(
      applicationContext,
      mockParams,
    );

    mockCases.forEach(mockCase => {
      expect(identifiers).toContain(`case|${mockCase.docketNumber}`);
    });
  });

  it('should wait until user is free before calling getCasesForUser', async () => {
    let resolver: Function;

    applicationContext
      .getPersistenceGateway()
      .getUserByIdOnceAllUpdatesComplete.mockImplementation(() => {
        return new Promise(resolve => (resolver = resolve));
      });

    void determineEntitiesToLock(applicationContext, mockParams);

    await sleep(50);
    expect(
      applicationContext.getPersistenceGateway().getCasesForUser,
    ).not.toHaveBeenCalled();

    await sleep(50);
    expect(
      applicationContext.getPersistenceGateway().getCasesForUser,
    ).not.toHaveBeenCalled();

    resolver!(null);
    await sleep(50);
    expect(
      applicationContext.getPersistenceGateway().getCasesForUser,
    ).toHaveBeenCalled();
  });
});

describe('updateUserContactInformationInteractor', () => {
  const mockRequest = {
    contactInfo: {
      ...MOCK_PRACTITIONER.contact,
      city: 'New York',
    },
    firmName: 'some firm',
    userId: MOCK_PRACTITIONER.userId,
    clientConnectionId: 'TEST_CLIENT_CONNECTION_ID',
  };

  beforeEach(() => {
    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      ...MOCK_PRACTITIONER,
      entityName: 'Practitioner',
    });

    applicationContext
      .getPersistenceGateway()
      .getUserByIdOnceAllUpdatesComplete.mockResolvedValue(null);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);

    applicationContext
      .getPersistenceGateway()
      .getCasesForUser.mockReturnValue([MOCK_CASE]);

    applicationContext
      .getPersistenceGateway()
      .setChangeOfAddressCaseAsDone.mockReturnValue([{ remaining: 0 }]);
  });

  describe('locked', () => {
    it('should throw a ServiceUnavailableError if a Case is currently locked', async () => {
      tryGetLock.mockResolvedValueOnce(false);

      await expect(
        updateUserContactInformationInteractor(
          applicationContext,
          mockRequest,
          MOCK_PRACTITIONER as UnknownAuthUser,
        ),
      ).rejects.toThrow(ServiceUnavailableError);

      expect(
        applicationContext.getPersistenceGateway().getCaseByDocketNumber,
      ).not.toHaveBeenCalled();
    });
  });

  describe('not locked', () => {
    it('should acquire and remove a lock', async () => {
      await updateUserContactInformationInteractor(
        applicationContext,
        mockRequest,
        MOCK_PRACTITIONER as UnknownAuthUser,
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
