import { documentViewerHelper as documentViewerHelperComputed } from '../../src/presenter/computeds/documentViewerHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const documentViewerHelper = withAppContextDecorator(
  documentViewerHelperComputed,
);

export const petitionsClerkServesPetitionFromDocumentView = test => {
  return it('petitions clerk serves electronic petition from document view', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const petitionDocumentId = test
      .getState('caseDetail.documents')
      .find(d => d.eventCode === 'P').documentId;

    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
      docketRecordTab: 'documentView',
      documentId: petitionDocumentId,
    });

    await test.runSequence('loadDefaultDocketViewerDocumentToDisplaySequence');

    let helper = runCompute(documentViewerHelper, {
      state: test.getState(),
    });

    expect(helper.showNotServed).toBeTruthy();
    expect(helper.showServePetitionButton).toBeTruthy();

    await test.runSequence('gotoPetitionQcSequence', {
      docketNumber: test.docketNumber,
      redirectUrl: `/case-detail/${test.docketNumber}/document-view?documentId=${petitionDocumentId}`,
    });

    expect(test.getState('currentPage')).toEqual('PetitionQc');

    await test.runSequence('saveSavedCaseForLaterSequence');

    expect(test.getState('currentPage')).toEqual('ReviewSavedPetition');

    await test.runSequence('openConfirmServeToIrsModalSequence');

    await test.runSequence('serveCaseToIrsSequence');

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    await test.runSequence('loadDefaultDocketViewerDocumentToDisplaySequence');

    helper = runCompute(documentViewerHelper, {
      state: test.getState(),
    });

    expect(helper.showServePetitionButton).toBeFalsy();
    expect(helper.showNotServed).toBeFalsy();
  });
};
