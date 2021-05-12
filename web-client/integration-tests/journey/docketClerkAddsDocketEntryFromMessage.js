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

export const docketClerkAddsDocketEntryFromMessage = test => {
  return it('docket clerk adds docket entry for order from a message', async () => {
    await test.runSequence('gotoMessageDetailSequence', {
      docketNumber: test.docketNumber,
      parentMessageId: test.parentMessageId,
    });

    let messageDetailFormatted = runCompute(formattedMessageDetail, {
      state: test.getState(),
    });
    const orderDocument = messageDetailFormatted.attachments[1];
    expect(orderDocument.documentTitle).toEqual('Order');

    await test.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
      docketEntryId: orderDocument.documentId,
      docketNumber: test.docketNumber,
      redirectUrl: `/messages/${test.docketNumber}/message-detail/${test.parentMessageId}`,
    });

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'freeText',
      value: 'something',
    });

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'serviceStamp',
      value: 'Served',
    });

    await test.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('currentPage')).toEqual('MessageDetail');

    const caseDetailFormatted = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });
    const caseOrderDocketEntry =
      caseDetailFormatted.formattedDocketEntries.find(
        d => d.docketEntryId === orderDocument.documentId,
      );
    expect(caseOrderDocketEntry).toBeDefined();
    expect(caseOrderDocketEntry.isOnDocketRecord).toEqual(true);
  });
};
