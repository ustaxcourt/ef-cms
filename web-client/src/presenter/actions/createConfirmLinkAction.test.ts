import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { createConfirmLinkAction } from '@web-client/presenter/actions/createConfirmLinkAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('createConfirmLinkAction', () => {
  const email = 'something@example.com';
  const oldEnv = process.env;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  afterAll(() => {
    process.env = oldEnv;
  });

  it('should return immediately if IS_LOCAL is not defined', async () => {
    delete process.env.IS_LOCAL;
    const result = await runAction(createConfirmLinkAction, {
      modules: {
        presenter,
      },
      props: {
        email,
      },
    });
    expect(result.output).toBeUndefined();
  });

  it('should construct an alertSuccess message when IS_LOCAL is "true"', async () => {
    process.env.IS_LOCAL = 'true';
    const result = await runAction(createConfirmLinkAction, {
      modules: {
        presenter,
      },
      props: {
        email,
      },
    });

    const confirmationLink =
      '/confirm-signup?confirmationCode=123456&email=something@example.com';

    const { alertType, message, title } = result.output!.alertSuccess;
    expect(alertType).toEqual('success');
    expect(message).toEqual(
      `New user account created successfully for ${email}! Please click the link below to verify your email address. </br><a rel="noopener noreferrer" href="${confirmationLink}">Verify Email Address</a>`,
    );
    expect(title).toEqual('Account Created Locally');
  });
});
