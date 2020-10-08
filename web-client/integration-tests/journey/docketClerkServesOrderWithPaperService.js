import { confirmInitiateServiceModalHelper } from '../../src/presenter/computeds/confirmInitiateServiceModalHelper';
import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkServesOrderWithPaperService = (
  test,
  draftOrderIndex,
) => {
  return it('Docket Clerk serves the order after the docket entry has been created (with parties with paper service)', async () => {
    let caseDetailFormatted;

    caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    const { docketEntryId } = test.draftOrders[draftOrderIndex];

    const orderDocument = caseDetailFormatted.formattedDocketEntries.find(
      doc => doc.docketEntryId === docketEntryId,
    );

    expect(orderDocument).toBeTruthy();

    await test.runSequence('gotoEditCourtIssuedDocketEntrySequence', {
      docketEntryId: orderDocument.docketEntryId,
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CourtIssuedDocketEntry');

    await test.runSequence('openConfirmInitiateServiceModalSequence');

    const helper = runCompute(
      withAppContextDecorator(confirmInitiateServiceModalHelper),
      {
        state: test.getState(),
      },
    );

    expect(helper.showPaperAlert).toEqual(true);
    expect(helper.contactsNeedingPaperService).toEqual([
      {
        name: 'Daenerys Stormborn, Petitioner',
      },
    ]);
    await test.runSequence('serveCourtIssuedDocumentFromDocketEntrySequence');

    expect(test.getState('currentPage')).toEqual('PrintPaperService');
    expect(test.getState('pdfPreviewUrl')).toBeDefined();
  });
};
