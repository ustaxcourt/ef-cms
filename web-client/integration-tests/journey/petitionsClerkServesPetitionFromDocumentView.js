import { documentViewerHelper as documentViewerHelperComputed } from '../../src/presenter/computeds/documentViewerHelper';
import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed);

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

    await test.runSequence('gotoMessagesSequence');
    expect(test.getState('currentPage')).toEqual('Messages');
    await test.runSequence('chooseWorkQueueSequence', {
      box: 'outbox',
      queue: 'section',
      workQueueIsInternal: false,
    });

    const formattedWorkItem = runCompute(formattedWorkQueue, {
      state: test.getState(),
    }).find(item => item.docketNumber === test.docketNumber);

    expect(formattedWorkItem.editLink).toContain('/document-view?documentId=');
  });
};
