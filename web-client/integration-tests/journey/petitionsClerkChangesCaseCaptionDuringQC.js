import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';

const { DOCKET_NUMBER_SUFFIXES } = applicationContext.getConstants();

export const petitionsClerkChangesCaseCaptionDuringQC = test => {
  return it('Petitions clerk changes case caption for an e-filed petition during petition QC, serves it, and verifies that a docket entry is added', async () => {
    await test.runSequence('gotoPetitionQcSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('PetitionQc');

    const initialCaption = test.getState('form.caseCaption');

    await test.runSequence('updateFormValueAndCaseCaptionSequence', {
      key: 'contactPrimary.name',
      value: 'A brand new name',
    });

    expect(test.getState('form.caseCaption')).toContain('A brand new name');

    await test.runSequence('saveSavedCaseForLaterSequence');

    expect(test.getState('caseDetail.initialCaption')).toEqual(initialCaption);
    expect(test.getState('caseDetail.caseCaption')).toContain(
      'A brand new name',
    );

    await test.runSequence('serveCaseToIrsSequence');

    await test.runSequence('gotoMessagesSequence', {
      box: 'outbox',
      queue: 'my',
      workQueueIsInternal: false,
    });

    const workItems = test.getState('workQueue');
    const thisWorkItem = workItems.find(
      workItem => workItem.docketNumber === test.docketNumber,
    );

    expect(thisWorkItem.docketNumberWithSuffix).not.toContain(
      DOCKET_NUMBER_SUFFIXES.LIEN_LEVY,
    );
    expect(thisWorkItem.caseTitle).toContain('A brand new name');

    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const docketRecord = test.getState('caseDetail.docketRecord');

    //case type was changed in an earlier test
    expect(docketRecord.pop().description).toContain(
      'Docket Number is amended',
    );
    expect(docketRecord.pop().description).toContain(
      'Caption of case is amended',
    );
  });
};
