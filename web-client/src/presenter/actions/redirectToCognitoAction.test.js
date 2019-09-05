import { applicationContext } from '../../applicationContext';
import { presenter } from '../presenter';
import { redirectToCognitoAction } from './redirectToCognitoAction';
import { runAction } from 'cerebral/test';

const externalRoute = jest.fn();

presenter.providers.applicationContext = applicationContext;
presenter.providers.router = { externalRoute };

describe('redirectToCognitoAction', () => {
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
