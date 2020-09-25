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

    await test.runSequence('gotoWorkQueueSequence', {
      box: 'outbox',
      queue: 'my',
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

    const docketEntries = test.getState('caseDetail.docketEntries');

    const caseAmended = docketEntries.find(entry =>
      entry.documentTitle.startsWith('Caption of case is amended'),
    );

    const docketNumberAmended = docketEntries.find(entry =>
      entry.documentTitle.startsWith('Docket Number is amended'),
    );

    //case type was changed in an earlier test
    expect(caseAmended).toBeTruthy();
    expect(docketNumberAmended).toBeTruthy();
  });
};
