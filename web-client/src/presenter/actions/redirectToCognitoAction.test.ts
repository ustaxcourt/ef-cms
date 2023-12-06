import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { redirectToCognitoAction } from './redirectToCognitoAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('redirectToCognitoAction', () => {
  const externalRoute = jest.fn();

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.providers.router = { externalRoute };
  });

  it('should redirect the app to the cognito url', async () => {
    await runAction(redirectToCognitoAction, {
      modules: {
        presenter,
      },
      state: {
        cognitoLoginUrl: 'http://example.com',
      },
    });
    expect(externalRoute.mock.calls[0][0]).toEqual('http://example.com');
  });
});
