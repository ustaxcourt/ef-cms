import { navigateToPublicSiteAction } from './navigateToPublicSiteAction';
import { presenter } from '../../presenter-public';
import { runAction } from '@web-client/presenter/test.cerebral';

let externalRouteMock;
const publicSiteUrlMock = 'example.com';

presenter.providers.applicationContext = {
  getPublicSiteUrl: () => publicSiteUrlMock,
};

describe('navigateToPublicSiteAction', () => {
  beforeAll(() => {
    externalRouteMock = jest.fn();
    presenter.providers.router = {
      externalRoute: externalRouteMock,
    };
  });

  it('Routes to the public site url', async () => {
    await runAction(navigateToPublicSiteAction, {
      modules: {
        presenter,
      },
    });

    expect(externalRouteMock).toHaveBeenCalledWith(publicSiteUrlMock);
  });
});
