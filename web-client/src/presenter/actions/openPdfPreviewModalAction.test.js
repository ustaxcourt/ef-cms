import { openPdfPreviewModalAction } from './openPdfPreviewModalAction';
import { runAction } from 'cerebral/test';

describe('openPdfPreviewModalAction', () => {
  it('sets state.previewPdfFile to props.file and sets showModal to PDFPreviewModal', async () => {
    const result = await runAction(openPdfPreviewModalAction, {
      props: { file: { name: 'something' } },
    });

    expect(result.state.previewPdfFile).toEqual({
      name: 'something',
    });
    expect(result.state.showModal).toEqual('PDFPreviewModal');
  });
});
