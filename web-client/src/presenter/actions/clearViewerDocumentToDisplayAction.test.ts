import { clearViewerDocumentToDisplayAction } from './clearViewerDocumentToDisplayAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('clearViewerDocumentToDisplayAction', () => {
  it('should clear the viewerDocumentToDisplay when props.tabName is documentViewer', async () => {
    const result = await runAction(clearViewerDocumentToDisplayAction, {
      props: {
        tabName: 'documentView',
      },
      state: {
        iframeSrc: 'http://example.com',
        viewerDocumentToDisplay: 'something',
      },
    });
    expect(result.state.iframeSrc).toBeUndefined();
    expect(result.state.viewerDocumentToDisplay).toBeUndefined();
  });

  it('should NOT clear the viewerDocumentToDisplay when props.tabName is NOT documentViewer', async () => {
    const result = await runAction(clearViewerDocumentToDisplayAction, {
      modules: {
        presenter,
      },
      props: {
        tabName: 'docketRecord',
      },
      state: {
        iframeSrc: 'http://example.com',
        viewerDocumentToDisplay: 'something',
      },
    });
    expect(result.state.iframeSrc).toEqual('http://example.com');
    expect(result.state.viewerDocumentToDisplay).toEqual('something');
  });
});
