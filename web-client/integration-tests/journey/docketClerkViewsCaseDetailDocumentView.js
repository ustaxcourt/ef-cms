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

export const docketClerkViewsCaseDetailDocumentView = cerebralTest => {
  return it('Docketclerk views case detail document view', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const caseDetail = cerebralTest.getState('caseDetail');

    await viewCaseDetail({
      cerebralTest,
      docketNumber: caseDetail.docketNumber,
    });
    const formatted = runCompute(formattedCaseDetail, {
      state: cerebralTest.getState(),
    });

    expect(formatted.pendingItemsDocketEntries.length).toEqual(1);

    await refreshElasticsearchIndex();

    const contactPrimary = contactPrimaryFromState(cerebralTest);
    expect(caseDetail.associatedJudge).toBeDefined();
    expect(caseDetail.status).toBeDefined();
    expect(contactPrimary.contactId).toBeDefined();

    await cerebralTest.runSequence(
      'changeTabAndSetViewerDocumentToDisplaySequence',
      {
        docketRecordTab: 'documentView',
        viewerDocumentToDisplay: {
          docketEntryId: formatted.pendingItemsDocketEntries[0].docketEntryId,
        },
      },
    );

    cerebralTest.docketEntryId =
      formatted.pendingItemsDocketEntries[0].docketEntryId;

    expect(cerebralTest.getState('docketEntryId')).toEqual(
      cerebralTest.docketEntryId,
    );

    expect(
      cerebralTest.getState('currentViewMetadata.caseDetail.docketRecordTab'),
    ).toEqual('documentView');
  });
};
