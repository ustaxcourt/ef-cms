import { addCourtIssuedDocketEntryNonstandardHelper } from '../../src/presenter/computeds/addCourtIssuedDocketEntryNonstandardHelper';
import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkAddsDocketEntryFromOrderOfDismissal = (
  test,
  draftOrderIndex,
) => {
  return it('Docket Clerk adds a docket entry from an Order of Dismissal', async () => {
    let caseDetailFormatted;
    let helperComputed;

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

    helperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryNonstandardHelper),
      {
        state: test.getState(),
      },
    );

    expect(test.getState('form.eventCode')).toEqual('OD');
    expect(test.getState('form.documentType')).toEqual(
      'Order of Dismissal Entered',
    );
    expect(helperComputed.showJudge).toBeTruthy();
    expect(test.getState('form.judge')).toBeFalsy();
    expect(helperComputed.showFreeText).toBeTruthy();
    expect(test.getState('form.freeText')).toBeFalsy();

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'judge',
      value: 'Judge Buch',
    });

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'freeText',
      value: 'for Something',
    });

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'attachments',
      value: true,
    });

    await test.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(test.getState('alertSuccess').message).toEqual(
      'Entry added to Docket Record.',
    );

    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    const newDocketEntry = caseDetailFormatted.docketRecordWithDocument.find(
      entry => entry.document && entry.document.documentId === documentId,
    );

    expect(newDocketEntry).toBeTruthy();
    expect(
      `${newDocketEntry.document.documentTitle} ${newDocketEntry.record.filingsAndProceedings}`,
    ).toEqual(
      'Order of Dismissal Entered, Judge Buch for Something (Attachment(s))',
    );
  });
};
