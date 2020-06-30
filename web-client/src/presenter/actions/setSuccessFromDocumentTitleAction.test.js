import { runAction } from 'cerebral/test';
import { setSuccessFromDocumentTitleAction } from './setSuccessFromDocumentTitleAction';

describe('setSuccessFromDocumentTitleAction,', () => {
  it('sets the success message from the documentTitle', async () => {
    const result = await runAction(setSuccessFromDocumentTitleAction, {
      props: {
        totalPenalties: '$112.99',
      },
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
      props: {
        totalPenalties: '$112.99',
      },
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
});
