import { runAction } from '@web-client/presenter/test.cerebral';
import { setPdfPreviewUrlAction } from './setPdfPreviewUrlAction';

describe('setPdfPreviewUrlAction', () => {
  it('sets the state.pdfPreviewUrl to the props.pdfUrl that was passed in', async () => {
    const result = await runAction(setPdfPreviewUrlAction, {
      props: { pdfUrl: '123' },
      state: {},
    });

    expect(result.state.pdfPreviewUrl).toEqual('123');
  });
});
