import { applicationContext } from '../../applicationContext';
import { presenter } from '../presenter';
import { redirectToCognitoAction } from './redirectToCognitoAction';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

presenter.providers.applicationContext = applicationContext;

describe('redirectToCognitoAction', () => {
  it('should redirect the app to the cognito url', async () => {
    global.window = {
      location: {
        replace: sinon.stub(),
      },
    };
    await runAction(redirectToCognitoAction, {
      state: {
        cognitoLoginUrl: 'http://example.com',
      },
    });
    expect(global.window.location.replace.getCall(0).args[0]).toEqual(
      'http://example.com',
    );
  });
});
