import { applicationContext, handler } from './cognito-triggers';

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
    const setUserEmailFromPendingEmailInteractor = jest.fn();

    beforeAll(() => {
      applicationContext.getPersistenceGateway = () => ({
        getUserById,
      });
      applicationContext.getUseCases = () => ({
        setUserEmailFromPendingEmailInteractor,
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
        setUserEmailFromPendingEmailInteractor.mock.calls[0][1].user,
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

      expect(setUserEmailFromPendingEmailInteractor).not.toHaveBeenCalled();
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

      expect(setUserEmailFromPendingEmailInteractor).not.toHaveBeenCalled();
    });
  });
});
