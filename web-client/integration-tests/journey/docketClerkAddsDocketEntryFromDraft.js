import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkAddsDocketEntryFromDraft = (test, draftOrderIndex) => {
  return it('Docket Clerk adds a docket entry from the given draft', async () => {
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
    expect(draftOrderDocument.numberOfPages).toEqual(1);

    await test.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
      docketNumber: test.docketNumber,
      documentId: draftOrderDocument.documentId,
    });

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'USCA',
    });

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'documentType',
      value: 'U.S.C.A',
    });

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'scenario',
      value: 'Type A',
    });

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'documentTitle',
      value: 'U.S.C.A created by a test',
    });

    await test.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(test.getState('alertSuccess').message).toEqual(
      'Your entry has been added to docket record.',
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
    const numberOfPagesIncludingCoversheet =
      draftOrderDocument.numberOfPages + 1;
    const updatedDocument = caseDetailFormatted.documents.find(
      doc => doc.documentId === documentId,
    );

    expect(newDocketEntry).toBeTruthy();
    expect(updatedDocument.numberOfPages).toEqual(
      numberOfPagesIncludingCoversheet,
    );
  });
};
