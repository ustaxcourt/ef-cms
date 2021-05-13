import { formattedMessageDetail as formattedMessageDetailComputed } from '../../src/presenter/computeds/formattedMessageDetail';
import { getFormattedDocketEntriesForTest } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedMessageDetail = withAppContextDecorator(
  formattedMessageDetailComputed,
);

export const petitionsClerkCreatesOrderFromMessage = test => {
  return it('petitions clerk creates an order from a message', async () => {
    await test.runSequence('gotoMessageDetailSequence', {
      docketNumber: test.docketNumber,
      parentMessageId: test.parentMessageId,
    });

    await test.runSequence('openCreateOrderChooseTypeModalSequence', {
      parentMessageId: test.parentMessageId,
    });

    await test.runSequence('updateCreateOrderModalFormValueSequence', {
      key: 'eventCode',
      value: 'O',
    });

    await test.runSequence('submitCreateOrderModalSequence');

    await test.runSequence('updateFormValueSequence', {
      key: 'richText',
      value: '<p>This is a test order.</p>',
    });

    await test.runSequence('submitCourtIssuedOrderSequence');

    expect(test.getState('validationErrors')).toEqual({});
    expect(test.getState('pdfPreviewUrl')).toBeDefined();

    await test.runSequence('setPDFSignatureDataSequence', {
      signatureData: {
        scale: 1,
        x: 100,
        y: 100,
      },
    });
    await test.runSequence('saveDocumentSigningSequence');

    expect(test.getState('currentPage')).toEqual('MessageDetail');

    const messageDetailFormatted = runCompute(formattedMessageDetail, {
      state: test.getState(),
    });
    expect(messageDetailFormatted.attachments.length).toEqual(2);
    expect(messageDetailFormatted.attachments[1]).toMatchObject({
      documentTitle: 'Order',
    });

    const { formattedDraftDocuments } = await getFormattedDocketEntriesForTest(
      test,
    );

    const draftOrder = formattedDraftDocuments.find(
      document => document.documentTitle === 'Order',
    );

    expect(draftOrder).toBeTruthy();
    expect(draftOrder.signedAt).toBeDefined();
  });
};
