import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionsClerkServesOrder = test => {
  return it('Petitions Clerk serves the order', async () => {
    let caseDetailFormatted;

    caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    const { documentId } = test;

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
    await test.runSequence('serveCourtIssuedDocumentFromDocketEntrySequence');
  });
};
