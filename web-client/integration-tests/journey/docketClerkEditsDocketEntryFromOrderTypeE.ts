import { FORMATS } from '@shared/business/utilities/DateHandler';
import { getFormattedDocketEntriesForTest } from '../helpers';

export const docketClerkEditsDocketEntryFromOrderTypeE = (
  cerebralTest,
  draftOrderIndex,
) => {
  return it(`Docket Clerk edits a docket entry from the given order ${draftOrderIndex} with nonstandard type E`, async () => {
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

    // Type E
    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'eventCode',
        value: 'OFFX',
      },
    );
    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'documentType',
        value: 'Order time is extended for petr(s) to pay the filing fee',
      },
    );
    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'documentTitle',
        value:
          'Order time is extended to [Date] for petr(s) to pay the filing fee',
      },
    );
    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'scenario',
        value: 'Type E',
      },
    );

    await cerebralTest.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      date: 'Enter a date',
    });

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'date',
        toFormat: FORMATS.ISO,
        value: '1/1/2002',
      },
    );

    await cerebralTest.runSequence('updateCourtIssuedDocketEntryTitleSequence');

    await cerebralTest.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    ({ formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest));

    const updatedOrderDocument = formattedDocketEntriesOnDocketRecord.find(
      doc => doc.docketEntryId === docketEntryId,
    );

    expect(updatedOrderDocument).toMatchObject({
      date: '2002-01-01T00:00:00.000-05:00',
      documentTitle:
        'Order time is extended to 01-01-2002 for petr(s) to pay the filing fee',
      documentType: 'Order time is extended for petr(s) to pay the filing fee',
      eventCode: 'OFFX',
    });

    await cerebralTest.runSequence('gotoEditCourtIssuedDocketEntrySequence', {
      docketEntryId: orderDocument.docketEntryId,
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('form')).toMatchObject({
      date: '2002-01-01T00:00:00.000-05:00',
      documentTitle:
        'Order time is extended to 01-01-2002 for petr(s) to pay the filing fee',
      documentType: 'Order time is extended for petr(s) to pay the filing fee',
      eventCode: 'OFFX',
      generatedDocumentTitle:
        'Order time is extended to 01-01-2002 for petr(s) to pay the filing fee',
    });
  });
};
