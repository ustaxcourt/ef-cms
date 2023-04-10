import { formattedMessageDetail as formattedMessageDetailComputed } from '../../src/presenter/computeds/formattedMessageDetail';
import { getFormattedDocketEntriesForTest } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedMessageDetail = withAppContextDecorator(
  formattedMessageDetailComputed,
);

export const docketClerkRemovesSignatureFromMessage = cerebralTest => {
  return it('docket clerk removes signature on an order from a message', async () => {
    await cerebralTest.runSequence('gotoMessageDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
      parentMessageId: cerebralTest.parentMessageId,
    });

    let messageDetailFormatted = runCompute(formattedMessageDetail, {
      state: cerebralTest.getState(),
    });
    const orderDocument = messageDetailFormatted.attachments[1];
    expect(orderDocument.documentTitle).toEqual('Order');

    await cerebralTest.runSequence('openConfirmRemoveSignatureModalSequence', {
      docketEntryIdToEdit: orderDocument.documentId,
    });

    await cerebralTest.runSequence('removeSignatureSequence');

    expect(cerebralTest.getState('currentPage')).toEqual('MessageDetail');

    const { formattedDraftDocuments } = await getFormattedDocketEntriesForTest(
      cerebralTest,
    );

    const caseOrderDocument = formattedDraftDocuments.find(
      d => d.docketEntryId === orderDocument.documentId,
    );
    expect(caseOrderDocument.signedAt).toEqual(null);
  });
};
