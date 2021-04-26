import {
  contactPrimaryFromState,
  refreshElasticsearchIndex,
  viewCaseDetail,
} from '../helpers';
import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const docketClerkViewsCaseDetailDocumentView = test => {
  return it('Docketclerk views case detail document view', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const caseDetail = test.getState('caseDetail');

    await viewCaseDetail({
      docketNumber: caseDetail.docketNumber,
      test,
    });
    const formatted = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });

    expect(formatted.pendingItemsDocketEntries.length).toEqual(1);

    await refreshElasticsearchIndex();

    const contactPrimary = contactPrimaryFromState(test);
    expect(caseDetail.associatedJudge).toBeDefined();
    expect(caseDetail.status).toBeDefined();
    expect(contactPrimary.contactId).toBeDefined();

    await test.runSequence('changeTabAndSetViewerDocumentToDisplaySequence', {
      docketRecordTab: 'documentView',
      viewerDocumentToDisplay: {
        docketEntryId: formatted.pendingItemsDocketEntries[0].docketEntryId,
      },
    });

    test.docketEntryId = formatted.pendingItemsDocketEntries[0].docketEntryId;

    expect(test.getState('docketEntryId')).toEqual(test.docketEntryId);

    expect(
      test.getState('currentViewMetadata.caseDetail.docketRecordTab'),
    ).toEqual('documentView');
  });
};
