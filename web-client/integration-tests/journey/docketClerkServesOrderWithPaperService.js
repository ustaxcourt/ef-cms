import { confirmInitiateServiceModalHelper } from '../../src/presenter/computeds/confirmInitiateServiceModalHelper';
import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { waitForRouter } from '../helpers';
import { withAppContextDecorator } from '../../src/withAppContext';

export default (test, draftOrderIndex) => {
  return it('Docket Clerk serves the order after the docket entry has been created (with parties with paper service)', async () => {
    let caseDetailFormatted;

    caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    const { documentId } = test.draftOrders[draftOrderIndex];

    const orderDocument = caseDetailFormatted.documents.find(
      doc => doc.documentId === documentId,
    );

    expect(orderDocument).toBeTruthy();

    await test.runSequence('gotoEditCourtIssuedDocketEntrySequence', {
      docketNumber: test.docketNumber,
      documentId: orderDocument.documentId,
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
      { name: 'Test Person, Petitioner' },
    ]);
    await test.runSequence('serveCourtIssuedDocumentSequence');

    await waitForRouter();

    expect(test.getState('currentPage')).toEqual('PrintPreview');
    expect(test.getState('pdfPreviewUrl')).toBeDefined();
  });
};
