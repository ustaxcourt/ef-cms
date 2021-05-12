import { formattedDocketEntries as formattedDocketEntriesComputed } from '../../src/presenter/computeds/formattedDocketEntries';
import { formattedMessageDetail as formattedMessageDetailComputed } from '../../src/presenter/computeds/formattedMessageDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedDocketEntries = withAppContextDecorator(
  formattedDocketEntriesComputed,
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
      docketEntryIdToEdit: orderDocument.documentId,
    });

    await test.runSequence('removeSignatureSequence');

    expect(test.getState('currentPage')).toEqual('MessageDetail');

    const helper = runCompute(formattedDocketEntries, {
      state: test.getState(),
    });
    const caseOrderDocument = helper.formattedDraftDocuments.find(
      d => d.docketEntryId === orderDocument.documentId,
    );
    expect(caseOrderDocument.signedAt).toEqual(null);
  });
};
