import { openPdfPreviewModalAction } from './openPdfPreviewModalAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('openPdfPreviewModalAction', () => {
  it('sets state.previewPdfFile to props.file and sets showModal to PDFPreviewModal', async () => {
    const result = await runAction(openPdfPreviewModalAction, {
      props: {
        file: { name: 'something' },
        modalId: 'PDFPreview-something-unique',
      },
    });

    expect(result.state.previewPdfFile).toEqual({
      name: 'something',
    });
    expect(result.state.modal.showModal).toEqual('PDFPreview-something-unique');
  });
});
