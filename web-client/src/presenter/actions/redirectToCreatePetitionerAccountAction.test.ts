import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { redirectToCreatePetitionerAccountAction } from '@web-client/presenter/actions/redirectToCreatePetitionerAccountAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('redirectToCreatePetitionerAccountAction', () => {
  const mockExternalRoute = jest.fn();

  presenter.providers.applicationContext = applicationContext;

  presenter.providers.router = {
    externalRoute: mockExternalRoute,
  };

  it('should call route with the correct url for create petitioner', async () => {
    const mockPrivateUrl = 'localhost:5678';
    applicationContext.getPrivateUrl.mockReturnValue(mockPrivateUrl);

    await runAction(redirectToCreatePetitionerAccountAction, {
      modules: {
        presenter,
      },
    });

    expect(mockExternalRoute).toHaveBeenCalledWith(
      `${mockPrivateUrl}/create-account/petitioner`,
    );
  });
});
