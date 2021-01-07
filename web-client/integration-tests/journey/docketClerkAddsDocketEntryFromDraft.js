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

    const { docketEntryId } = test.draftOrders[draftOrderIndex];

    const draftOrderDocument = caseDetailFormatted.draftDocuments.find(
      doc => doc.docketEntryId === docketEntryId,
    );

    expect(draftOrderDocument).toBeTruthy();
    expect(draftOrderDocument.numberOfPages).toEqual(1);

    await test.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
      docketEntryId: draftOrderDocument.docketEntryId,
      docketNumber: test.docketNumber,
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

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'filingDateMonth',
      value: '1',
    });
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'filingDateDay',
      value: '1',
    });
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'filingDateYear',
      value: '2021',
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

    const numberOfPagesIncludingCoversheet =
      draftOrderDocument.numberOfPages + 1;
    const updatedDocument = caseDetailFormatted.formattedDocketEntries.find(
      doc => doc.docketEntryId === docketEntryId,
    );

    expect(updatedDocument.numberOfPages).toEqual(
      numberOfPagesIncludingCoversheet,
    );
  });
};
