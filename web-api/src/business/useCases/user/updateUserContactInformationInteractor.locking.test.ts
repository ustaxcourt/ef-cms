import '@web-api/persistence/postgres/users/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
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
import { tryGetLocks as tryGetLocksMock } from '@web-api/persistence/postgres/utils/operation/tryGetLocks';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { setChangeOfAddressCaseAsDone as setChangeOfAddressCaseAsDoneMock } from '@web-api/persistence/postgres/jobs/changeOfAddress/setChangeOfAddressCaseAsDone';
import { getDocketNumbersByUser as getDocketNumbersByUserMock } from '@web-api/persistence/postgres/users/getDocketNumbersByUser';
import { getUserByIdOnceAllUpdatesComplete as getUserByIdOnceAllUpdatesCompleteMock } from '@web-api/persistence/postgres/users/getUserByIdOnceAllUpdatesComplete';
import { getUserById as getUserByIdMock } from '@web-api/persistence/postgres/users/getUserById';
import { DbUser } from '@web-api/persistence/postgres/users/mapper';

const getCaseByDocketNumber = jest.mocked(getCaseByDocketNumberMock);
const setChangeOfAddressCaseAsDone = jest.mocked(
  setChangeOfAddressCaseAsDoneMock,
);
const getDocketNumbersByUser = jest.mocked(getDocketNumbersByUserMock);
const getUserByIdOnceAllUpdatesComplete = jest.mocked(
  getUserByIdOnceAllUpdatesCompleteMock,
);
const getUserById = jest.mocked(getUserByIdMock);
const tryGetLocks = jest.mocked(tryGetLocksMock);

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
    getDocketNumbersByUser.mockResolvedValue(
      mockCases.map(c => c.docketNumber),
    );
    getUserByIdOnceAllUpdatesComplete.mockResolvedValue(undefined as any);
  });

  it('should lookup the docket numbers for the specified user', async () => {
    await determineEntitiesToLock(applicationContext, mockParams);
    expect(getDocketNumbersByUser).toHaveBeenCalledWith({
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

    getUserByIdOnceAllUpdatesComplete.mockImplementation(() => {
      return new Promise(resolve => (resolver = resolve));
    });

    void determineEntitiesToLock(applicationContext, mockParams);

    await sleep(50);
    expect(getDocketNumbersByUser).not.toHaveBeenCalled();

    await sleep(50);
    expect(getDocketNumbersByUser).not.toHaveBeenCalled();

    resolver!(null);
    await sleep(50);
    expect(getDocketNumbersByUser).toHaveBeenCalled();
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
    getUserById.mockResolvedValue(MOCK_PRACTITIONER as DbUser);
    getUserByIdOnceAllUpdatesComplete.mockResolvedValue(null as any);
    getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);
    getDocketNumbersByUser.mockResolvedValue([MOCK_CASE.docketNumber]);
    setChangeOfAddressCaseAsDone.mockResolvedValue([]);
  });

  describe('locked', () => {
    it('should throw a ServiceUnavailableError if a Case is currently locked', async () => {
      tryGetLocks.mockResolvedValueOnce([
        { successfullyLocked: false, identifier: 'abc' },
      ]);

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

      expect(tryGetLocks).toHaveBeenCalledWith(
        expect.objectContaining({
          identifiers: [`case|${MOCK_CASE.docketNumber}`],
        }),
      );
    });
  });
});
