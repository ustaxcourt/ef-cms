import { navigateToCognitoAction } from './navigateToCognitoAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('navigateToCognitoAction', () => {
  let externalRouteMock;

  beforeAll(() => {
    externalRouteMock = jest.fn();
    presenter.providers.router = {
      externalRoute: externalRouteMock,
    };
  });

  it('should call the router to navigate to the cognito url from state', async () => {
    await runAction(navigateToCognitoAction, {
      modules: {
        presenter,
      },
      state: { cognitoLoginUrl: 'http://example.com' },
    });

    expect(externalRouteMock).toHaveBeenCalledWith('http://example.com');
  });
});
