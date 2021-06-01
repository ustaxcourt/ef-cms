import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { formattedMessageDetail as formattedMessageDetailComputed } from '../../src/presenter/computeds/formattedMessageDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkEditsOrderFromMessage = test => {
  const formattedCaseDetail = withAppContextDecorator(
    formattedCaseDetailComputed,
  );

  const formattedMessageDetail = withAppContextDecorator(
    formattedMessageDetailComputed,
  );

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
      docketEntryIdToEdit: orderDocument.documentId,
      docketNumber: test.docketNumber,
      parentMessageId: test.parentMessageId,
      redirectUrl: `/messages/${test.docketNumber}/message-detail/${test.parentMessageId}`,
    });

    await test.runSequence('navigateToEditOrderSequence');

    expect(test.getState('currentPage')).toEqual('CreateOrder');
    expect(test.getState('form.documentTitle')).toEqual('Order');

    await test.runSequence('openEditOrderTitleModalSequence');

    expect(test.getState('modal.eventCode')).toEqual('O');
    expect(test.getState('modal.documentTitle')).toEqual('Order');

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
    const caseOrderDocument = caseDetailFormatted.formattedDocketEntries.find(
      d => d.docketEntryId === orderDocument.documentId,
    );
    expect(caseOrderDocument.signedAt).toEqual(null);
    expect(caseOrderDocument.documentTitle).toBeDefined();
  });
};
