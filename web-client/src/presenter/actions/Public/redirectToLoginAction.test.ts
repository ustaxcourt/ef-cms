import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '@web-client/presenter/presenter-mock';
import { redirectToLoginAction } from '@web-client/presenter/actions/Public/redirectToLoginAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('redirectToLoginAction', () => {
  const mockExternalRoute = jest.fn();

  presenter.providers.applicationContext = applicationContext;

  presenter.providers.router = {
    externalRoute: mockExternalRoute,
  };

  it('should call route with the correct url for login', async () => {
    const mockPrivateUrl = 'localhost:5678';
    applicationContext.getPrivateUrl.mockReturnValue(mockPrivateUrl);

    await runAction(redirectToLoginAction, {
      modules: {
        presenter,
      },
    });

    expect(mockExternalRoute).toHaveBeenCalledWith(`${mockPrivateUrl}/login`);
  });
});
