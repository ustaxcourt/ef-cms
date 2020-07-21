import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { formattedMessageDetail as formattedMessageDetailComputed } from '../../src/presenter/computeds/formattedMessageDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

const formattedMessageDetail = withAppContextDecorator(
  formattedMessageDetailComputed,
);

export const docketClerkRemovesSignatureFromMessage = test => {
  return it('docket clerk removes signature on an order from a message', async () => {
    await test.runSequence('gotoMessageDetailSequence', {
      docketNumber: test.docketNumber,
      parentMessageId: test.parentMessageId,
    });

    let messageDetailFormatted = runCompute(formattedMessageDetail, {
      state: test.getState(),
    });
    const orderDocument = messageDetailFormatted.attachments[1];
    expect(orderDocument.documentTitle).toEqual('Order');

    await test.runSequence('openConfirmRemoveSignatureModalSequence', {
      documentIdToEdit: orderDocument.documentId,
    });

    await test.runSequence('removeSignatureSequence');

    expect(test.getState('currentPage')).toEqual('MessageDetail');

    const caseDetailFormatted = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });
    const caseOrderDocument = caseDetailFormatted.documents.find(
      d => d.documentId === orderDocument.documentId,
    );
    expect(caseOrderDocument.signedAt).toEqual(null);
  });
};
