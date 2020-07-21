import { runAction } from 'cerebral/test';
import { setSuccessFromDocumentTitleAction } from './setSuccessFromDocumentTitleAction';

describe('setSuccessFromDocumentTitleAction,', () => {
  it('sets the success message from the documentTitle', async () => {
    const result = await runAction(setSuccessFromDocumentTitleAction, {
      state: {
        caseDetail: {
          documents: [
            {
              documentId: 'abc',
              documentTitle: 'Order',
            },
          ],
        },
        documentId: 'abc',
      },
    });

    expect(result.output.alertSuccess.message).toEqual('Order updated.');
  });

  it('sets the success message from the documentType if documentTitle is not present', async () => {
    const result = await runAction(setSuccessFromDocumentTitleAction, {
      state: {
        caseDetail: {
          documents: [
            {
              documentId: 'abc',
              documentType: 'Order',
            },
          ],
        },
        documentId: 'abc',
      },
    });

    expect(result.output.alertSuccess.message).toEqual('Order updated.');
  });

  it('sets the created document success message if state.isCreatingOrder is true', async () => {
    const result = await runAction(setSuccessFromDocumentTitleAction, {
      state: {
        caseDetail: {
          documents: [
            {
              documentId: 'abc',
              documentType: 'Order',
            },
          ],
        },
        documentId: 'abc',
        isCreatingOrder: true,
      },
    });

    expect(result.output.alertSuccess.message).toEqual(
      'Your document has been successfully created and attached to this message',
    );
  });
});
