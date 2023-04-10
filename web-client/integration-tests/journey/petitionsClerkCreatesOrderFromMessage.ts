import { formattedMessageDetail as formattedMessageDetailComputed } from '../../src/presenter/computeds/formattedMessageDetail';
import { getFormattedDocketEntriesForTest } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedMessageDetail = withAppContextDecorator(
  formattedMessageDetailComputed,
);

export const petitionsClerkCreatesOrderFromMessage = cerebralTest => {
  return it('petitions clerk creates an order from a message', async () => {
    await cerebralTest.runSequence('gotoMessageDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
      parentMessageId: cerebralTest.parentMessageId,
    });

    await cerebralTest.runSequence('openCreateOrderChooseTypeModalSequence', {
      parentMessageId: cerebralTest.parentMessageId,
    });

    await cerebralTest.runSequence('updateCreateOrderModalFormValueSequence', {
      key: 'eventCode',
      value: 'O',
    });

    await cerebralTest.runSequence('submitCreateOrderModalSequence');

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'richText',
      value: '<p>This is a test order.</p>',
    });

    await cerebralTest.runSequence('submitCourtIssuedOrderSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});
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

    const messageDetailFormatted = runCompute(formattedMessageDetail, {
      state: cerebralTest.getState(),
    });
    expect(messageDetailFormatted.attachments.length).toEqual(2);
    expect(messageDetailFormatted.attachments[1]).toMatchObject({
      documentTitle: 'Order',
    });

    const { formattedDraftDocuments } = await getFormattedDocketEntriesForTest(
      cerebralTest,
    );

    const draftOrder = formattedDraftDocuments.find(
      document => document.documentTitle === 'Order',
    );

    expect(draftOrder).toBeTruthy();
    expect(draftOrder.signedAt).toBeDefined();
  });
};
