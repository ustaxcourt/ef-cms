import { formattedMessageDetail as formattedMessageDetailComputed } from '../../src/presenter/computeds/formattedMessageDetail';
import { getFormattedDocketEntriesForTest } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkEditsOrderFromMessage = cerebralTest => {
  const formattedMessageDetail = withAppContextDecorator(
    formattedMessageDetailComputed,
  );

  return it('docket clerk edits a signed order from a message', async () => {
    await cerebralTest.runSequence('gotoMessageDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
      parentMessageId: cerebralTest.parentMessageId,
    });

    let messageDetailFormatted = runCompute(formattedMessageDetail, {
      state: cerebralTest.getState(),
    });
    const orderDocument = messageDetailFormatted.attachments[1];
    expect(orderDocument.documentTitle).toEqual('Order');

    await cerebralTest.runSequence('openConfirmEditModalSequence', {
      docketEntryIdToEdit: orderDocument.documentId,
      docketNumber: cerebralTest.docketNumber,
      parentMessageId: cerebralTest.parentMessageId,
      redirectUrl: `/messages/${cerebralTest.docketNumber}/message-detail/${cerebralTest.parentMessageId}`,
    });

    await cerebralTest.runSequence('navigateToEditOrderSequence');

    expect(cerebralTest.getState('currentPage')).toEqual('CreateOrder');
    expect(cerebralTest.getState('form.documentTitle')).toEqual('Order');

    await cerebralTest.runSequence('openEditOrderTitleModalSequence');

    expect(cerebralTest.getState('modal.eventCode')).toEqual('O');
    expect(cerebralTest.getState('modal.documentTitle')).toEqual('Order');

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'richText',
      value: '<p>This is an updated order.</p>',
    });

    await cerebralTest.runSequence('submitCourtIssuedOrderSequence');

    expect(cerebralTest.getState('currentPage')).toEqual('SignOrder');
    expect(cerebralTest.getState('pdfPreviewUrl')).toBeDefined();

    await cerebralTest.runSequence('skipSigningOrderSequence');

    expect(cerebralTest.getState('currentPage')).toEqual('MessageDetail');

    messageDetailFormatted = runCompute(formattedMessageDetail, {
      state: cerebralTest.getState(),
    });
    expect(messageDetailFormatted.attachments.length).toEqual(2);

    const { formattedDraftDocuments } = await getFormattedDocketEntriesForTest(
      cerebralTest,
    );

    const caseOrderDocument = formattedDraftDocuments.find(
      d => d.docketEntryId === orderDocument.documentId,
    );
    expect(caseOrderDocument.signedAt).toEqual(null);
    expect(caseOrderDocument.documentTitle).toBeDefined();
  });
};
