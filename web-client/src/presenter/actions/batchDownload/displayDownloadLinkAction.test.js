import { displayDownloadLinkAction } from './displayDownloadLinkAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('displayDownloadLinkAction', () => {
  it('should call the router openInNewTab function', async () => {
    const openInNewTab = jest.fn();
    presenter.providers.router = { openInNewTab };

    await runAction(displayDownloadLinkAction, {
      modules: {
        presenter,
      },
      props: {
        url: 'https://example.com',
      },
    });

    expect(openInNewTab).toHaveBeenCalledWith('https://example.com', false);
  });
});
