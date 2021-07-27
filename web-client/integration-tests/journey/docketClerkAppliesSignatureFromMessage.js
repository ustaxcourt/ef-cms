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

export const docketClerkAppliesSignatureFromMessage = cerebralTest => {
  return it('docket clerk applies signature to an order from a message', async () => {
    await cerebralTest.runSequence('gotoMessageDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
      parentMessageId: cerebralTest.parentMessageId,
    });

    let messageDetailFormatted = runCompute(formattedMessageDetail, {
      state: cerebralTest.getState(),
    });
    const orderDocument = messageDetailFormatted.attachments[1];
    expect(orderDocument.documentTitle).toEqual('Order');

    await cerebralTest.runSequence('gotoSignOrderSequence', {
      docketEntryId: orderDocument.documentId,
      docketNumber: cerebralTest.docketNumber,
      parentMessageId: cerebralTest.parentMessageId,
      redirectUrl: `/messages/${cerebralTest.docketNumber}/message-detail/${cerebralTest.parentMessageId}`,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('SignOrder');
    expect(cerebralTest.getState('pdfPreviewUrl')).toBeDefined();

    await cerebralTest.runSequence('setPDFSignatureDataSequence', {
      signatureData: {
        scale: 1,
        x: 100,
        y: 100,
      },
    });
    await cerebralTest.runSequence('saveDocumentSigningSequence');

    expect(cerebralTest.getState('currentPage')).toEqual('MessageDetail');

    const caseDetailFormatted = runCompute(formattedCaseDetail, {
      state: cerebralTest.getState(),
    });
    const caseOrderDocument = caseDetailFormatted.formattedDocketEntries.find(
      d => d.docketEntryId === orderDocument.documentId,
    );
    expect(caseOrderDocument.signedAt).toBeDefined();
  });
};
