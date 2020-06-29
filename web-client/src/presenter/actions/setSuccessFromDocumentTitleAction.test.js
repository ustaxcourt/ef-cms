import { runAction } from 'cerebral/test';
import { setSuccessFromDocumentTitleAction } from './setSuccessFromDocumentTitleAction';

describe('setSuccessFromDocumentTitleAction,', () => {
  it('sets the totalPenalties value for the given index', async () => {
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
});
