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

    const { docketEntryId } = test.draftOrders[draftOrderIndex];

    const draftOrderDocument = caseDetailFormatted.draftDocuments.find(
      doc => doc.docketEntryId === docketEntryId,
    );

    expect(draftOrderDocument).toBeTruthy();

    await test.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
      docketEntryId: draftOrderDocument.docketEntryId,
      docketNumber: test.docketNumber,
    });

    helperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryNonstandardHelper),
      {
        state: test.getState(),
      },
    );

    expect(test.getState('form.eventCode')).toEqual('OD');
    expect(test.getState('form.documentType')).toEqual('Order of Dismissal');
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
      'Your entry has been added to docket record.',
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
