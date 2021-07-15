import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';

const { DOCKET_NUMBER_SUFFIXES } = applicationContext.getConstants();

export const petitionsClerkChangesCaseCaptionDuringQC = cerebralTest => {
  return it('Petitions clerk changes case caption for an e-filed petition during petition QC, serves it, and verifies that a docket entry is added', async () => {
    await cerebralTest.runSequence('gotoPetitionQcSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('PetitionQc');

    const initialCaption = cerebralTest.getState('form.caseCaption');

    await cerebralTest.runSequence('updateFormValueAndCaseCaptionSequence', {
      key: 'contactPrimary.name',
      value: 'A brand new name',
    });

    expect(cerebralTest.getState('form.caseCaption')).toContain(
      'A brand new name',
    );

    await cerebralTest.runSequence('saveSavedCaseForLaterSequence');

    expect(cerebralTest.getState('caseDetail.initialCaption')).toEqual(
      initialCaption,
    );
    expect(cerebralTest.getState('caseDetail.caseCaption')).toContain(
      'A brand new name',
    );

    await cerebralTest.runSequence('serveCaseToIrsSequence');

    await cerebralTest.runSequence('gotoWorkQueueSequence', {
      box: 'outbox',
      queue: 'my',
    });

    const workItems = cerebralTest.getState('workQueue');
    const thisWorkItem = workItems.find(
      workItem => workItem.docketNumber === cerebralTest.docketNumber,
    );

    expect(thisWorkItem.docketNumberWithSuffix).not.toContain(
      DOCKET_NUMBER_SUFFIXES.LIEN_LEVY,
    );
    expect(thisWorkItem.caseTitle).toContain('A brand new name');

    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const docketEntries = cerebralTest.getState('caseDetail.docketEntries');

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
