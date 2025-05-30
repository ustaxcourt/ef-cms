jest.mock('@web-api/business/useCases/user/generateChangeOfAddress');
import { COUNTRY_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { MOCK_LOCK } from '../../../../../shared/src/test/mockLock';
import { MOCK_PRACTITIONER } from '../../../../../shared/src/test/mockUsers';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import {
  determineEntitiesToLock,
  updateUserContactInformationInteractor,
} from './updateUserContactInformationInteractor';
import { sleep } from '@shared/tools/helpers';

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
  let mockLock;

  const mockRequest = {
    contactInfo: {
      ...MOCK_PRACTITIONER.contact,
      city: 'New York',
    },
    firmName: 'some firm',
    userId: MOCK_PRACTITIONER.userId,
    clientConnectionId: 'TEST_CLIENT_CONNECTION_ID',
  };

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
  });

  beforeEach(() => {
    mockLock = undefined; // unlocked

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
      .setChangeOfAddressCaseAsDone.mockReturnValue({ remaining: 0 });
  });

  describe('locked', () => {
    beforeEach(() => {
      mockLock = MOCK_LOCK;
    });

    it('should throw a ServiceUnavailableError if a Case is currently locked', async () => {
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
    beforeEach(() => {
      mockLock = undefined;
    });

    it('should acquire a lock that lasts for 15 minutes', async () => {
      await updateUserContactInformationInteractor(
        applicationContext,
        mockRequest,
        MOCK_PRACTITIONER as UnknownAuthUser,
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
      await updateUserContactInformationInteractor(
        applicationContext,
        mockRequest,
        MOCK_PRACTITIONER as UnknownAuthUser,
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
