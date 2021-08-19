import { VALIDATION_ERROR_MESSAGES } from '../../../shared/src/business/entities/courtIssuedDocument/CourtIssuedDocumentConstants';
import { getFormattedDocketEntriesForTest } from '../helpers';

export const docketClerkConvertsAnOrderToAnOpinion = (
  cerebralTest,
  draftOrderIndex,
) => {
  return it(`Docket Clerk edits a docket entry from the given order ${draftOrderIndex} with nonstandard type B`, async () => {
    const { docketEntryId } = cerebralTest.draftOrders[draftOrderIndex];

    let { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);

    const orderDocument = formattedDocketEntriesOnDocketRecord.find(
      doc => doc.docketEntryId === docketEntryId,
    );

    expect(orderDocument).toBeTruthy();

    await cerebralTest.runSequence('gotoEditCourtIssuedDocketEntrySequence', {
      docketEntryId: orderDocument.docketEntryId,
      docketNumber: cerebralTest.docketNumber,
    });

    // Type B
    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'eventCode',
        value: 'TCOP',
      },
    );
    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'documentType',
        value: 'T.C. Opinion',
      },
    );
    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'documentTitle',
        value: 'T.C. Opinion [judge] [anything]',
      },
    );
    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'scenario',
        value: 'Type B',
      },
    );

    await cerebralTest.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      judge: VALIDATION_ERROR_MESSAGES.judge,
    });

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'judge',
        value: 'Judge Pugh',
      },
    );

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'freeText',
        value: 'freeeeee text',
      },
    );

    await cerebralTest.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    ({ formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest));

    const updatedOrderDocument = formattedDocketEntriesOnDocketRecord.find(
      doc => doc.docketEntryId === docketEntryId,
    );

    expect(updatedOrderDocument).toMatchObject({
      documentTitle: 'T.C. Opinion Judge Pugh freeeeee text',
      documentType: 'T.C. Opinion',
      eventCode: 'TCOP',
      freeText: 'freeeeee text',
      judge: 'Judge Pugh',
    });

    await cerebralTest.runSequence('gotoEditCourtIssuedDocketEntrySequence', {
      docketEntryId: orderDocument.docketEntryId,
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('form')).toMatchObject({
      documentTitle: 'T.C. Opinion Judge Pugh freeeeee text',
      documentType: 'T.C. Opinion',
      eventCode: 'TCOP',
      freeText: 'freeeeee text',
      generatedDocumentTitle: 'T.C. Opinion Judge Pugh freeeeee text',
      judge: 'Judge Pugh',
    });
  });
};
