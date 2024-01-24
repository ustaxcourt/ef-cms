import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { handler } from './cognito-triggers';
const mockCreatePetitionerAccountInteractor = jest.fn();
const mockGetUserById = jest.fn();
const mockSetUserEmailFromPendingEmailInteractor = jest.fn();
const mockGetDocketNumbersByUser = jest.fn();
const mockGetWebSocketConnectionsByUserId = jest.fn();
const mockGetCaseByDocketNumber = jest.fn();
const mockUpdateUser = jest.fn();
jest.mock('../../../src/applicationContext', () => {
  return {
    createApplicationContext: () => ({
      getNotificationClient: () => ({
        postToConnection: () => ({
          promise: () => Promise.resolve(),
        }),
      }),
      getPersistenceGateway: () => ({
        getCaseByDocketNumber: mockGetCaseByDocketNumber,
        getDocketNumbersByUser: mockGetDocketNumbersByUser,
        getUserById: mockGetUserById,
        getWebSocketConnectionsByUserId: mockGetWebSocketConnectionsByUserId,
        updateUser: mockUpdateUser,
      }),
      getUseCases: () => ({
        createPetitionerAccountInteractor:
          mockCreatePetitionerAccountInteractor,
        setUserEmailFromPendingEmailInteractor:
          mockSetUserEmailFromPendingEmailInteractor,
      }),
      logger: {
        info: jest.fn(),
      },
    }),
  };
});

describe('cognito-triggers', () => {
  describe('PostAuthentication_Authentication', () => {
    const mockUserId = '531c2772-fd45-4640-b60e-1bc06c28c693';
    const mockSub = '1234abc';
    const mockEmail = 'goodbye@example.com';

    it('should retrieve the user from persistence with custom:userId when one is defined', async () => {
      const mockEvent = {
        request: {
          userAttributes: {
            ['custom:userId']: mockUserId,
            email: mockEmail,
            name: 'test petitioner',
          },
        },
        triggerSource: 'PostAuthentication_Authentication',
      };

      await handler(mockEvent);

      expect(mockGetUserById.mock.calls[0][0].userId).toEqual(mockUserId);
    });

    it('should retrieve the user from persistence with sub as the userId when custom:userId is not defined', async () => {
      const mockEvent = {
        request: {
          userAttributes: {
            email: mockEmail,
            name: 'test petitioner',
            sub: mockSub,
          },
        },
        triggerSource: 'PostAuthentication_Authentication',
      };

      await handler(mockEvent);

      expect(mockGetUserById.mock.calls[0][0].userId).toEqual(mockSub);
    });

    it('should call setUserEmailFromPendingEmailInteractor when the user from persistence has a pendingEmail that matches the email used to log in', async () => {
      mockGetUserById.mockReturnValue({ pendingEmail: mockEmail });
      const mockEvent = {
        request: {
          userAttributes: {
            email: mockEmail,
            name: 'test petitioner',
            sub: mockSub,
          },
        },
        triggerSource: 'PostAuthentication_Authentication',
      };

      await handler(mockEvent);

      expect(
        mockSetUserEmailFromPendingEmailInteractor.mock.calls[0][1].user,
      ).toEqual({ pendingEmail: mockEmail });
    });

    it('should not call setUserEmailFromPendingEmailInteractor when the user from persistence does not have a pendingEmail', async () => {
      mockGetUserById.mockReturnValue({});

      const mockEvent = {
        request: {
          userAttributes: {
            email: mockEmail,
            name: 'test petitioner',
            sub: mockSub,
          },
        },
        triggerSource: 'PostAuthentication_Authentication',
      };

      await handler(mockEvent);

      expect(mockSetUserEmailFromPendingEmailInteractor).not.toHaveBeenCalled();
    });

    it('should not call setUserEmailFromPendingEmailInteractor when the user from persistence has a pendingEmail that does not match the email used to log in', async () => {
      mockGetUserById.mockReturnValue({
        pendingEmail: 'mockEmail@example.com',
      });

      const mockEvent = {
        request: {
          userAttributes: {
            email: mockEmail,
            name: 'test petitioner',
            sub: mockSub,
          },
        },
        triggerSource: 'PostAuthentication_Authentication',
      };

      await handler(mockEvent);

      expect(mockSetUserEmailFromPendingEmailInteractor).not.toHaveBeenCalled();
    });

    it('should send a notification email for each case updated', async () => {
      const mockPractitioner = {
        admissionsDate: '1991-01-13',
        admissionsStatus: 'Active',
        barNumber: 'PT1234',
        birthYear: '1995',
        contact: {
          address1: '234 Main St',
          address2: 'Apartment 4',
          address3: 'Under the stairs',
          city: 'Chicago',
          countryType: 'domestic',
          phone: '+1 (555) 555-5555',
          postalCode: '61234',
          state: 'IL',
        },
        email: 'privatePractitioner@example.com',
        employer: 'Private',
        entityName: 'PrivatePractitioner',
        firstName: 'Bob',
        lastName: 'Billy',
        name: 'Test Private Practitioner',
        originalBarState: 'TN',
        pendingEmail: 'mockEmail@example.com',
        pk: 'case|105-20',
        practitionerType: 'Attorney',
        representing: ['7805d1ab-18d0-43ec-bafb-654e83405416'],
        representingPrimary: true,
        role: 'privatePractitioner',
        section: 'privatePractitioner',
        serviceIndicator: 'Electronic',
        sk: 'privatePractitioner|9805d1ab-18d0-43ec-bafb-654e83405416',
        userId: '9805d1ab-18d0-43ec-bafb-654e83405416',
      };
      mockGetUserById.mockReturnValue(mockPractitioner);
      mockGetDocketNumbersByUser.mockReturnValue(['101-19']);
      mockGetWebSocketConnectionsByUserId.mockReturnValue([
        {
          connectionId: '123',
          endpoint: 'http://example.com',
        },
      ]);
      mockGetCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        privatePractitioners: [mockPractitioner],
      });
      const mockEvent = {
        request: {
          userAttributes: {
            email: 'mockEmail@example.com',
            name: 'test practitioner',
            sub: mockSub,
          },
        },
        triggerSource: 'PostAuthentication_Authentication',
      };

      await handler(mockEvent);

      expect(mockSetUserEmailFromPendingEmailInteractor).toHaveBeenCalled();
    });
  });
});
