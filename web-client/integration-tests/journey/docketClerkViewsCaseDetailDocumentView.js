import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { refreshElasticsearchIndex, viewCaseDetail } from '../helpers';
import { runCompute } from 'cerebral/test';

export const docketClerkViewsCaseDetailDocumentView = (
  test,
  docketNumber = null,
) => {
  return it('Docketclerk views case detail document view', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: docketNumber || test.docketNumber,
    });

    const caseDetail = test.getState('caseDetail');

    await viewCaseDetail({
      docketNumber: caseDetail.docketNumber,
      test,
    });
    const formatted = runCompute(formattedCaseDetailComputed, {
      state: test.getState(),
    });

    expect(formatted.pendingItemsDocketEntries.length).toEqual(1);

    await refreshElasticsearchIndex();

    expect(caseDetail.associatedJudge).toBeDefined();
    expect(caseDetail.status).toBeDefined();
    expect(caseDetail.userId).toBeDefined();

    await test.runSequence('changeTabAndSetViewerDocumentToDisplaySequence', {
      docketRecordTab: 'documentView',
      viewerDocumentToDisplay: {
        documentId: formatted.pendingItemsDocketEntries[0].documentId,
      },
    });

    test.documentId = formatted.pendingItemsDocketEntries[0].documentId;

    expect(
      test.getState('currentViewMetadata.caseDetail.docketRecordTab'),
    ).toEqual('documentView');
  });
};
