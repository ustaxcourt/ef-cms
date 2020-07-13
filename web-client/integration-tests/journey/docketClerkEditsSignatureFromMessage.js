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

export const docketClerkEditsSignatureFromMessage = test => {
  return it('docket clerk edits signature on an order from a message', async () => {
    await test.runSequence('gotoMessageDetailSequence', {
      docketNumber: test.docketNumber,
      parentMessageId: test.parentMessageId,
    });

    let messageDetailFormatted = runCompute(formattedMessageDetail, {
      state: test.getState(),
    });
    const orderDocument = messageDetailFormatted.attachments[1];
    expect(orderDocument.documentTitle).toEqual('Order');

    await test.runSequence('openConfirmEditSignatureModalSequence', {
      documentIdToEdit: orderDocument.documentId,
    });

    await test.runSequence('removeSignatureAndGotoEditSignatureSequence');

    expect(test.getState('currentPage')).toEqual('SignOrder');
    expect(test.getState('pdfPreviewUrl')).toBeDefined();

    await test.runSequence('saveDocumentSigningSequence');

    expect(test.getState('currentPage')).toEqual('MessageDetail');

    const caseDetailFormatted = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });
    const caseOrderDocument = caseDetailFormatted.documents.find(
      d => d.documentId === orderDocument.documentId,
    );
    expect(caseOrderDocument.signedAt).toBeDefined();
  });
};
