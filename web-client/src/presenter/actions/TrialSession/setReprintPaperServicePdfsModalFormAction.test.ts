import { runAction } from '@web-client/presenter/test.cerebral';
import { setReprintPaperServicePdfsModalFormAction } from './setReprintPaperServicePdfsModalFormAction';

describe('setReprintPaperServicePdfsModalFormAction', () => {
  it('should initialize the list of selected pdfs for reprint', async () => {
    const { state } = await runAction(
      setReprintPaperServicePdfsModalFormAction,
      {
        state: {
          modal: {
            form: {},
          },
        },
      },
    );

    expect(state.modal.form.selectedPdf).toEqual('');
  });
});
