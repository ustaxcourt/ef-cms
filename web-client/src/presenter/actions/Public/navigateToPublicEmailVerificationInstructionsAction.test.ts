import { navigateToPublicEmailVerificationInstructionsAction } from './navigateToPublicEmailVerificationInstructionsAction';
import { presenter } from '../../presenter-public';
import { runAction } from '@web-client/presenter/test.cerebral';

let externalRouteMock;
const publicSiteUrlMock = 'example.com';

presenter.providers.applicationContext = {
  getPublicSiteUrl: () => publicSiteUrlMock,
};

describe('navigateToPublicEmailVerificationInstructionsAction', () => {
  beforeAll(() => {
    externalRouteMock = jest.fn();
    presenter.providers.router = {
      externalRoute: externalRouteMock,
    };
  });

  it('Routes to the public site email-verification-instructions url', async () => {
    await runAction(navigateToPublicEmailVerificationInstructionsAction, {
      modules: {
        presenter,
      },
    });

    expect(externalRouteMock).toHaveBeenCalledWith(
      `${publicSiteUrlMock}/email-verification-instructions`,
    );
  });
});
