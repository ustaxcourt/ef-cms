import { COUNTRY_TYPES } from '../../entities/EntityConstants';
import { MOCK_CASE } from '../../../test/mockCase';
import { MOCK_LOCK } from '../../../test/mockLock';
import { MOCK_PRACTITIONER } from '../../../test/mockUsers';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '../../test/createTestApplicationContext';
import {
  determineEntitiesToLock,
  handleLockError,
  updateUserContactInformationInteractor,
} from './updateUserContactInformationInteractor';

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
});

describe('handleLockError', () => {
  it('should determine who the user is based on applicationContext', async () => {
    await handleLockError(applicationContext, { foo: 'bar' });
    expect(applicationContext.getCurrentUser).toHaveBeenCalled();
  });

  it('should send a notification to the user with "retry_async_request" and the originalRequest', async () => {
    const mockOriginalRequest = {
      foo: 'bar',
    };
    await handleLockError(applicationContext, mockOriginalRequest);
    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0].message,
    ).toMatchObject({
      action: 'retry_async_request',
      originalRequest: mockOriginalRequest,
      requestToRetry: 'update_user_contact_information',
    });
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
  };

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
  });

  beforeEach(() => {
    mockLock = undefined; // unlocked

    applicationContext.getCurrentUser.mockReturnValue(MOCK_PRACTITIONER);

    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      ...MOCK_PRACTITIONER,
      entityName: 'Practitioner',
    });

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
        updateUserContactInformationInteractor(applicationContext, mockRequest),
      ).rejects.toThrow(ServiceUnavailableError);

      expect(
        applicationContext.getPersistenceGateway().getCaseByDocketNumber,
      ).not.toHaveBeenCalled();
    });

    it('should return a "retry_async_request" notification with the original request', async () => {
      await expect(
        updateUserContactInformationInteractor(applicationContext, mockRequest),
      ).rejects.toThrow(ServiceUnavailableError);

      expect(
        applicationContext.getNotificationGateway().sendNotificationToUser,
      ).toHaveBeenCalledWith({
        applicationContext,
        message: {
          action: 'retry_async_request',
          originalRequest: mockRequest,
          requestToRetry: 'update_user_contact_information',
        },
        userId: MOCK_PRACTITIONER.userId,
      });

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
