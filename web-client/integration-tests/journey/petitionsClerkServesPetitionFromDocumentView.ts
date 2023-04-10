import { documentViewerHelper as documentViewerHelperComputed } from '../../src/presenter/computeds/documentViewerHelper';
import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed);

const documentViewerHelper = withAppContextDecorator(
  documentViewerHelperComputed,
);

export const petitionsClerkServesPetitionFromDocumentView = cerebralTest => {
  return it('petitions clerk serves electronic petition from document view', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const petitionDocketEntryId = cerebralTest
      .getState('caseDetail.docketEntries')
      .find(d => d.eventCode === 'P').docketEntryId;

    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketEntryId: petitionDocketEntryId,
      docketNumber: cerebralTest.docketNumber,
      docketRecordTab: 'documentView',
    });

    await cerebralTest.runSequence(
      'loadDefaultDocketViewerDocumentToDisplaySequence',
    );

    let helper = runCompute(documentViewerHelper, {
      state: cerebralTest.getState(),
    });

    expect(helper.showNotServed).toBeTruthy();
    expect(helper.showServePetitionButton).toBeTruthy();

    await cerebralTest.runSequence('gotoPetitionQcSequence', {
      docketNumber: cerebralTest.docketNumber,
      redirectUrl: `/case-detail/${cerebralTest.docketNumber}/document-view?docketEntryId=${petitionDocketEntryId}`,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'hasVerifiedIrsNotice',
      value: false,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('PetitionQc');

    await cerebralTest.runSequence('saveSavedCaseForLaterSequence');

    expect(cerebralTest.getState('currentPage')).toEqual('ReviewSavedPetition');

    await cerebralTest.runSequence('openConfirmServeToIrsModalSequence');

    await cerebralTest.runSequence('serveCaseToIrsSequence');

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');

    await cerebralTest.runSequence(
      'loadDefaultDocketViewerDocumentToDisplaySequence',
    );

    helper = runCompute(documentViewerHelper, {
      state: cerebralTest.getState(),
    });

    expect(helper.showServePetitionButton).toBeFalsy();
    expect(helper.showNotServed).toBeFalsy();

    await cerebralTest.runSequence('gotoWorkQueueSequence');
    expect(cerebralTest.getState('currentPage')).toEqual('WorkQueue');
    await cerebralTest.runSequence('chooseWorkQueueSequence', {
      box: 'outbox',
      queue: 'section',
    });

    const formattedWorkItem = runCompute(formattedWorkQueue, {
      state: cerebralTest.getState(),
    }).find(item => item.docketNumber === cerebralTest.docketNumber);

    expect(formattedWorkItem.editLink).toContain(
      '/document-view?docketEntryId=',
    );
  });
};
