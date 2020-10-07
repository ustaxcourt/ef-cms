import { applicationContext, handler } from './cognito-triggers';

describe('cognito-triggers', () => {
  describe('handler', () => {
    it('should create a petitioner when the event trigger is  PostConfirmation_ConfirmSignUp', async () => {
      const createPetitionerAccountInteractor = jest.fn();
      applicationContext.getUseCases = () => ({
        createPetitionerAccountInteractor,
      });

      const mockEvent = {
        request: {
          userAttributes: {
            email: 'ms6471@example.com',
            name: 'test petitioner',
            sub: '7adb95de-1d05-4bd6-851d-676d5358f693',
          },
        },
        triggerSource: 'PostConfirmation_ConfirmSignUp',
      };

      await handler(mockEvent);

      expect(createPetitionerAccountInteractor).toHaveBeenCalled();
    });
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
