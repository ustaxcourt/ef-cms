import { runAction } from '@web-client/presenter/test.cerebral';
import { setPdfFileAction } from './setPdfFileAction';

describe('setPdfFileAction', () => {
  it('sets primary document file in form', async () => {
    const result = await runAction(setPdfFileAction, {
      props: {
        pdfFile: 'pdf file',
      },
    });

    expect(result.state.form.primaryDocumentFile).toEqual('pdf file');
  });
});
