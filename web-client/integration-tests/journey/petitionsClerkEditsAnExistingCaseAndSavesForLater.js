import { Case } from '../../../shared/src/business/entities/cases/Case';

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

    // expect(test.getState('currentPage')).toEqual('ReviewPetitionFromPaper');

    await test.runSequence('saveSavedCaseForLaterSequence');

    // expect(test.getState('currentPage')).toEqual('Messages');

    /////
    await test.runSequence('gotoDocumentDetailSequence', {
      docketNumber: test.docketNumber,
      documentId: test.documentId,
    });

    await test.runSequence('openConfirmServeToIrsModalSequence');

    expect(test.getState('showModal')).toBe('ConfirmServeToIrsModal');

    await test.runSequence('saveCaseAndServeToIrsSequence');

    expect(test.getState('currentPage')).toEqual('CaseDetail');

    // await test.runSequence('chooseWorkQueueSequence', {
    //   box: 'served',
    //   queue: 'my',
    // });
    // const workQueue = test.getState('workQueue');
    // const servedCase = workQueue.find(
    //   i => i.docketNumber === test.docketNumber,
    // );

    // expect(servedCase.status).toEqual(Case.STATUS_TYPES.generalDocket);
  });
};
