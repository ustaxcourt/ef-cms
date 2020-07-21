import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkAddsTranscriptDocketEntryFromOrder = (
  test,
  draftOrderIndex,
  date,
) => {
  return it('Docket Clerk adds a docket entry for a transcript from the given order', async () => {
    let caseDetailFormatted;

    caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    const { documentId } = test.draftOrders[draftOrderIndex];

    const draftOrderDocument = caseDetailFormatted.draftDocuments.find(
      doc => doc.documentId === documentId,
    );

    expect(draftOrderDocument).toBeTruthy();

    await test.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
      docketNumber: test.docketNumber,
      documentId: draftOrderDocument.documentId,
    });

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'TRAN',
    });
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'documentType',
      value: 'Transcript',
    });
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'documentTitle',
      value: 'Transcript of [anything] on [date]',
    });
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'scenario',
      value: 'Type H',
    });

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'freeText',
      value: 'Anything',
    });

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'month',
      value: date.month,
    });
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'day',
      value: date.day,
    });
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'year',
      value: date.year,
    });

    await test.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('alertSuccess').message).toEqual(
      'Entry added to Docket Record.',
    );

    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    caseDetailFormatted = await runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    const newDocketEntry = caseDetailFormatted.docketRecord.find(
      entry => entry.documentId === documentId,
    );

    expect(newDocketEntry).toBeTruthy();
  });
};
