import { addCourtIssuedDocketEntryNonstandardHelper } from '../../src/presenter/computeds/addCourtIssuedDocketEntryNonstandardHelper';
import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkAddsDocketEntryFromOrderOfDismissal = (
  cerebralTest,
  draftOrderIndex,
) => {
  return it('Docket Clerk adds a docket entry from an Order of Dismissal', async () => {
    let caseDetailFormatted;
    let helperComputed;

    caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: cerebralTest.getState(),
      },
    );

    const { docketEntryId } = cerebralTest.draftOrders[draftOrderIndex];

    const draftOrderDocument = caseDetailFormatted.draftDocuments.find(
      doc => doc.docketEntryId === docketEntryId,
    );

    expect(draftOrderDocument).toBeTruthy();

    await cerebralTest.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
      docketEntryId: draftOrderDocument.docketEntryId,
      docketNumber: cerebralTest.docketNumber,
    });

    helperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryNonstandardHelper),
      {
        state: cerebralTest.getState(),
      },
    );

    expect(cerebralTest.getState('form.eventCode')).toEqual('OD');
    expect(cerebralTest.getState('form.documentType')).toEqual(
      'Order of Dismissal',
    );
    expect(helperComputed.showJudge).toBeTruthy();
    expect(cerebralTest.getState('form.judge')).toBeFalsy();
    expect(helperComputed.showFreeText).toBeTruthy();
    expect(cerebralTest.getState('form.freeText')).toBeFalsy();

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'judge',
        value: 'Buch',
      },
    );

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'freeText',
        value: 'for Something',
      },
    );

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'attachments',
        value: true,
      },
    );

    expect(cerebralTest.getState('form.generatedDocumentTitle')).toContain(
      'Judge Buch for Something',
    );

    await cerebralTest.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(cerebralTest.getState('alertSuccess').message).toEqual(
      'Your entry has been added to docket record.',
    );

    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: cerebralTest.getState(),
      },
    );

    const newDocketEntry = caseDetailFormatted.formattedDocketEntries.find(
      entry => entry && entry.docketEntryId === docketEntryId,
    );

    expect(newDocketEntry).toBeTruthy();
    expect(
      `${newDocketEntry.documentTitle} ${newDocketEntry.filingsAndProceedings}`,
    ).toEqual(
      'Order of Dismissal Entered, Judge Buch for Something (Attachment(s))',
    );
  });
};
