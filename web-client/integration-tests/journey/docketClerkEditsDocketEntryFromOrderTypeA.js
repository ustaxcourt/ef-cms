import { getFormattedDocketEntriesForTest } from '../helpers';

export const docketClerkEditsDocketEntryFromOrderTypeA = (
  test,
  draftOrderIndex,
) => {
  return it(`Docket Clerk edits a docket entry from the given order ${draftOrderIndex} with nonstandard type A`, async () => {
    const { docketEntryId } = test.draftOrders[draftOrderIndex];

    let { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(test);

    const orderDocument = formattedDocketEntriesOnDocketRecord.find(
      doc => doc.docketEntryId === docketEntryId,
    );

    expect(orderDocument).toBeTruthy();

    await test.runSequence('gotoEditCourtIssuedDocketEntrySequence', {
      docketEntryId: orderDocument.docketEntryId,
      docketNumber: test.docketNumber,
    });

    // Type A
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'WRIT',
    });
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'documentType',
      value: 'Writ of Habeas Corpus Ad Testificandum',
    });
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'documentTitle',
      value: 'Writ of Habeas Corpus Ad Testificandum [anything]',
    });
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'scenario',
      value: 'Type A',
    });

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'freeText',
      value: 'Some free text',
    });

    await test.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(test.getState('validationErrors')).toEqual({});

    ({ formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(test));

    const updatedOrderDocument = formattedDocketEntriesOnDocketRecord.find(
      doc => doc.docketEntryId === docketEntryId,
    );

    expect(updatedOrderDocument).toMatchObject({
      documentTitle: 'Writ of Habeas Corpus Ad Testificandum Some free text',
      documentType: 'Writ of Habeas Corpus Ad Testificandum',
      eventCode: 'WRIT',
      freeText: 'Some free text',
    });

    await test.runSequence('gotoEditCourtIssuedDocketEntrySequence', {
      docketEntryId: orderDocument.docketEntryId,
      docketNumber: test.docketNumber,
    });

    expect(test.getState('form')).toMatchObject({
      documentTitle: 'Writ of Habeas Corpus Ad Testificandum Some free text',
      documentType: 'Writ of Habeas Corpus Ad Testificandum',
      eventCode: 'WRIT',
      freeText: 'Some free text',
      generatedDocumentTitle:
        'Writ of Habeas Corpus Ad Testificandum Some free text',
    });
  });
};
