import { Case } from '../../../shared/src/business/entities/cases/Case';
import { getFormattedDocumentQCSectionOutbox, wait } from '../helpers';

export default test => {
  return it('Petitions clerk edits an existing case and saves for later', async () => {
    await test.runSequence('gotoDocumentDetailSequence', {
      docketNumber: test.docketNumber,
      documentId: test.documentId,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'partyType',
      value: 'Guardian',
    });

    await test.runSequence('validatePetitionFromPaperSequence');

    expect(test.getState('alertError')).toBeUndefined();
    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('navigateToReviewPetitionFromPaperSequence');
    await test.runSequence('gotoReviewPetitionFromPaperSequence');

    expect(test.getState('currentPage')).toEqual('ReviewPetitionFromPaper');

    await test.runSequence('saveSavedCaseForLaterSequence');
    await wait(5000);

    expect(test.getState('currentPage')).toEqual('Messages');

    await test.runSequence('gotoDocumentDetailSequence', {
      docketNumber: test.docketNumber,
      documentId: test.documentId,
    });
    await test.runSequence('openConfirmServeToIrsModalSequence');

    expect(test.getState('showModal')).toBe('ConfirmServeToIrsModal');

    await test.runSequence('saveCaseAndServeToIrsSequence');
    await wait(5000);

    expect(test.currentRouteUrl).toEqual(`/case-detail/${test.caseId}`);

    await test.runSequence('navigateToPathSequence', {
      path: '/document-qc/my/outbox',
    });
    await test.runSequence('chooseWorkQueueSequence', {
      box: 'outbox',
      queue: 'my',
    });
    await wait(5000);

    const workQueueToDisplay = test.getState('workQueueToDisplay');

    expect(workQueueToDisplay.workQueueIsInternal).toBeFalsy();
    expect(workQueueToDisplay.queue).toEqual('my');
    expect(workQueueToDisplay.box).toEqual('outbox');

    const servedCase = test
      .getState('workQueue')
      .find(x => x.docketNumber === test.docketNumber);

    expect(servedCase).toMatchObject({
      caseTitle: 'Mona Schultz',
    });
    expect(servedCase.caseStatus).toEqual(Case.STATUS_TYPES.generalDocket);

    await test.runSequence('navigateToPathSequence', {
      path: 'document-qc/section/outbox',
    });
    await test.runSequence('chooseWorkQueueSequence', {
      box: 'outbox',
      queue: 'section',
    });
    await wait(5000);

    const sectionWorkQueueToDisplay = test.getState('workQueueToDisplay');

    expect(sectionWorkQueueToDisplay.workQueueIsInternal).toBeFalsy();
    expect(sectionWorkQueueToDisplay.queue).toEqual('section');
    expect(sectionWorkQueueToDisplay.box).toEqual('outbox');

    const sectionServedCase = test
      .getState('workQueue')
      .find(x => x.docketNumber === test.docketNumber);

    expect(sectionServedCase).toMatchObject({
      caseTitle: 'Mona Schultz',
    });
    expect(sectionServedCase.caseStatus).toEqual(
      Case.STATUS_TYPES.generalDocket,
    );

    const outboxItems = await getFormattedDocumentQCSectionOutbox(test);
    const desiredItem = outboxItems.find(
      x => x.docketNumber === test.docketNumber,
    );
    expect(desiredItem.sentBy).toEqual('Test Petitionsclerk');
  });
};
