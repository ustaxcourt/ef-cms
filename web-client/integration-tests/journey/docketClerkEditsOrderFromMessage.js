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

export const docketClerkEditsOrderFromMessage = test => {
  return it('docket clerk edits a signed order from a message', async () => {
    await test.runSequence('gotoMessageDetailSequence', {
      docketNumber: test.docketNumber,
      parentMessageId: test.parentMessageId,
    });

    let messageDetailFormatted = runCompute(formattedMessageDetail, {
      state: test.getState(),
    });
    const orderDocument = messageDetailFormatted.attachments[1];
    expect(orderDocument.documentTitle).toEqual('Order');

    await test.runSequence('openConfirmEditModalSequence', {
      docketNumber: test.docketNumber,
      documentIdToEdit: orderDocument.documentId,
      parentMessageId: test.parentMessageId,
      redirectUrl: `/case-messages/${test.docketNumber}/message-detail/${test.parentMessageId}`,
    });

    await test.runSequence('navigateToEditOrderSequence');

    expect(test.getState('currentPage')).toEqual('CreateOrder');
    expect(test.getState('form.documentTitle')).toEqual('Order');

    await test.runSequence('updateFormValueSequence', {
      key: 'richText',
      value: '<p>This is an updated order.</p>',
    });

    await test.runSequence('submitCourtIssuedOrderSequence');

    expect(test.getState('currentPage')).toEqual('SignOrder');
    expect(test.getState('pdfPreviewUrl')).toBeDefined();

    await test.runSequence('skipSigningOrderSequence');

    expect(test.getState('currentPage')).toEqual('MessageDetail');

    messageDetailFormatted = runCompute(formattedMessageDetail, {
      state: test.getState(),
    });
    expect(messageDetailFormatted.attachments.length).toEqual(2);

    const caseDetailFormatted = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });
    const caseOrderDocument = caseDetailFormatted.documents.find(
      d => d.documentId === orderDocument.documentId,
    );
    expect(caseOrderDocument.signedAt).toEqual(null);
    expect(caseOrderDocument.documentTitle).toBeDefined();
  });
};
