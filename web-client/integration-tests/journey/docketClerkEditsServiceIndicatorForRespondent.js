import { SERVICE_INDICATOR_TYPES } from '../../../shared/src/business/entities/cases/CaseConstants';

export default test => {
  return it('docket clerk edits service indicator for a respondent', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('openEditRespondentsModalSequence');

    expect(test.getState('modal.respondents.0.serviceIndicator')).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );

    await test.runSequence('updateModalValueSequence', {
      key: 'respondents.0.serviceIndicator',
      value: SERVICE_INDICATOR_TYPES.SI_PAPER,
    });

    expect(test.getState('caseDetail.respondents.0.serviceIndicator')).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );

    await test.runSequence('submitEditRespondentsModalSequence');

    expect(test.getState('caseDetail.respondents.0.serviceIndicator')).toEqual(
      SERVICE_INDICATOR_TYPES.SI_PAPER,
    );
  });
};
