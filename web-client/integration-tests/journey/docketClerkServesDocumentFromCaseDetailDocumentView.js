import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { refreshElasticsearchIndex, viewCaseDetail } from '../helpers';
import { runCompute } from 'cerebral/test';

export const docketClerkServesDocumentFromCaseDetailDocumentView = test => {
  return it('Docketclerk serves document from case detail document view', async () => {
    await test.runSequence('openConfirmServeCourtIssuedDocumentSequence', {
      documentId: test.documentId,
      redirectUrl: `/case-detail/${test.docketNumber}/document-view?documentId=${test.documentId}`,
    });

    expect(test.getState('modal.showModal')).toEqual(
      'ConfirmInitiateCourtIssuedDocumentServiceModal',
    );

    await test.runSequence('serveCourtIssuedDocumentSequence');
  });
};
