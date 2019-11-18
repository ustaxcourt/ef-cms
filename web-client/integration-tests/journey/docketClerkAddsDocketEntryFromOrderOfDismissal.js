import { addCourtIssuedDocketEntryNonstandardHelper } from '../../src/presenter/computeds/addCourtIssuedDocketEntryNonstandardHelper';
import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export default (test, draftOrderIndex) => {
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
      doc => (doc.documentId = documentId),
    );

    expect(draftOrderDocument).toBeTruthy();

    await test.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
      docketNumber: draftOrderDocument.docketNumber,
      documentId: draftOrderDocument.documentId,
    });

    helperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryNonstandardHelper),
    );

    expect(test.getState('form.eventCode')).toEqual('OD');
    expect(test.getState('form.documentType')).toEqual('Order of Dismissal');
    expect(helperComputed.showJudge).toBeTruthy();
    expect(test.getState('form.judge')).toEqual('');
    expect(helperComputed.showFreeText).toBeTruthy();
    expect(test.getState('form.freeText')).toEqual('');

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

    caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    expect(test.getState('currentPage')).toEqual('CaseDetail');
    expect(test.getState('alertSuccess').title).toEqual(
      'Your entry has been added to the docket record.',
    );

    const newDocketEntry = caseDetailFormatted.docketRecordWithDocument.find(
      entry => entry.document.documentId === documentId,
    );

    expect(newDocketEntry).toBeTruthy();
    expect(
      `${newDocketEntry.documentTitle} ${newDocketEntry.filingsAndProceedings}`,
    ).toEqual(
      'Order of Dismissal Entered, Judge Buch for Something (Attachment(s))',
    );
  });
};
