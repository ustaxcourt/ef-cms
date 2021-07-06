import { applicationContext, handler } from './cognito-triggers';
import { setUserEmailFromPendingEmailInteractor } from '../../../../shared/src/business/useCases/users/setUserEmailFromPendingEmailInteractor';
const { MOCK_CASE } = require('../../../../shared/src/test/mockCase');

describe('cognito-triggers', () => {
  describe('PostConfirmation_ConfirmSignUp', () => {
    it('should create a petitioner when the event trigger is  PostConfirmation_ConfirmSignUp', async () => {
      const createPetitionerAccountInteractor = jest.fn();
      applicationContext.getUseCases = () => ({
        createPetitionerAccountInteractor,
      });

      const mockEvent = {
        request: {
          userAttributes: {
            email: 'hello@example.com',
            name: 'test petitioner',
            sub: '7adb95de-1d05-4bd6-851d-676d5358f693',
          },
        },
        triggerSource: 'PostConfirmation_ConfirmSignUp',
      };

      await handler(mockEvent);

      expect(createPetitionerAccountInteractor).toHaveBeenCalled();
    });

    it('should not create a petitioner when the event trigger is not PostConfirmation_ConfirmSignUp', async () => {
      const createPetitionerAccountInteractor = jest.fn();
      applicationContext.getUseCases = () => ({
        createPetitionerAccountInteractor,
      });

      const mockEvent = {
        request: {},
        triggerSource: 'PostConfirmation_ConfirmForgotPassword',
      };

      await handler(mockEvent);

      expect(createPetitionerAccountInteractor).not.toHaveBeenCalled();
    });
  });

  describe('PostAuthentication_Authentication', () => {
    const mockUserId = '531c2772-fd45-4640-b60e-1bc06c28c693';
    const mockSub = '1234abc';
    const mockEmail = 'goodbye@example.com';
    const getUserById = jest.fn();
    const setUserEmailFromPendingEmailInteractorMock = jest.fn();
    const getDocketNumbersByUser = jest.fn();
    const getCaseByDocketNumber = jest.fn();
    const updatePrivatePractitionerOnCase = jest.fn();
    const getNotificationClient = jest.fn();
    const updateCase = jest.fn();
    const updateUser = jest.fn();
    const getWebSocketConnectionsByUserId = jest.fn();

    beforeEach(() => {
      applicationContext.getPersistenceGateway = () => ({
        getCaseByDocketNumber,
        getDocketNumbersByUser,
        getUserById,
        getWebSocketConnectionsByUserId,
        updateCase,
        updatePrivatePractitionerOnCase,
        updateUser,
      });
      applicationContext.getNotificationClient = getNotificationClient;
      applicationContext.getUseCases = () => ({
        setUserEmailFromPendingEmailInteractor:
          setUserEmailFromPendingEmailInteractorMock,
      });
    });

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

      expect(getUserById.mock.calls[0][0].userId).toEqual(mockUserId);
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

      expect(getUserById.mock.calls[0][0].userId).toEqual(mockSub);
    });

    it('should call setUserEmailFromPendingEmailInteractor when the user from persistence has a pendingEmail that matches the email used to log in', async () => {
      getUserById.mockReturnValue({ pendingEmail: mockEmail });

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
        setUserEmailFromPendingEmailInteractorMock.mock.calls[0][1].user,
      ).toEqual({ pendingEmail: mockEmail });
    });

    it('should not call setUserEmailFromPendingEmailInteractor when the user from persistence does not have a pendingEmail', async () => {
      getUserById.mockReturnValue({});

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

      expect(setUserEmailFromPendingEmailInteractorMock).not.toHaveBeenCalled();
    });

    it('should not call setUserEmailFromPendingEmailInteractor when the user from persistence has a pendingEmail that does not match the email used to log in', async () => {
      getUserById.mockReturnValue({ pendingEmail: 'mockEmail@example.com' });

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

      expect(setUserEmailFromPendingEmailInteractorMock).not.toHaveBeenCalled();
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
      getUserById.mockReturnValue(mockPractitioner);

      getDocketNumbersByUser.mockReturnValue(['101-19']);

      getWebSocketConnectionsByUserId.mockReturnValue([
        {
          connectionId: '123',
          endpoint: 'http://example.com',
        },
      ]);

      getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        privatePractitioners: [mockPractitioner],
      });

      applicationContext.getUseCases = () => ({
        setUserEmailFromPendingEmailInteractor,
      });

      getNotificationClient.mockReturnValue({
        postToConnection: () => ({
          promise: () => Promise.resolve(),
        }),
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

      expect(updateUser).toHaveBeenCalled();
    });
  });
});
