import { refreshElasticsearchIndex } from '../helpers';

export const petitionsClerkManuallyAddsCaseToCalendaredTrialSession = (
  cerebralTest,
  createdCasesIndex,
) => {
  return it('Petitions clerk manually adds a case to a calendared trial session', async () => {
    const caseToAdd = cerebralTest.createdCases[createdCasesIndex];

    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: caseToAdd,
    });

    await cerebralTest.runSequence('openAddToTrialModalSequence');

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'showAllLocations',
      value: true,
    });

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'trialSessionId',
      value: cerebralTest.trialSessionId,
    });

    await cerebralTest.runSequence('addCaseToTrialSessionSequence');
    await refreshElasticsearchIndex();

    expect(cerebralTest.getState('caseDetail.trialDate')).toBeDefined();
  });
};
