import { navigateToPublicEmailVerificationSuccessAction } from './navigateToPublicEmailVerificationSuccessAction';
import { presenter } from '../../presenter-public';
import { runAction } from '@web-client/presenter/test.cerebral';

let externalRouteMock;
const publicSiteUrlMock = 'example.com';

presenter.providers.applicationContext = {
  getPublicSiteUrl: () => publicSiteUrlMock,
};

describe('navigateToPublicEmailVerificationSuccessAction', () => {
  beforeAll(() => {
    externalRouteMock = jest.fn();
    presenter.providers.router = {
      externalRoute: externalRouteMock,
    };
  });

  it('Routes to the public site email-verification-success url', async () => {
    await runAction(navigateToPublicEmailVerificationSuccessAction, {
      modules: {
        presenter,
      },
    });

    expect(externalRouteMock).toHaveBeenCalledWith(
      `${publicSiteUrlMock}/email-verification-success`,
    );
  });
});
