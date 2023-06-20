import { clearViewerDocumentToDisplayAction } from './clearViewerDocumentToDisplayAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearViewerDocumentToDisplayAction', () => {
  it('should clear the viewerDocumentToDisplay and iframeSrc', async () => {
    const result = await runAction(clearViewerDocumentToDisplayAction, {
      state: {
        iframeSrc: 'http://example.com',
        viewerDocumentToDisplay: {},
      },
    });

    expect(result.state.iframeSrc).toBeUndefined();
    expect(result.state.viewerDocumentToDisplay).toBeUndefined();
  });
});
