import { constants } from '../../../shared/src/business/utilities/setServiceIndicatorsForCase';

export default test => {
  return it('docket clerk edits service indicator for a respondent', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('openEditRespondentsModalSequence');

    expect(test.getState('modal.respondents.0.serviceIndicator')).toEqual(
      constants.SI_ELECTRONIC,
    );

    await test.runSequence('updateModalValueSequence', {
      key: 'respondents.0.serviceIndicator',
      value: constants.SI_PAPER,
    });

    expect(test.getState('caseDetail.respondents.0.serviceIndicator')).toEqual(
      constants.SI_ELECTRONIC,
    );

    await test.runSequence('submitEditRespondentsModalSequence');

    expect(test.getState('caseDetail.respondents.0.serviceIndicator')).toEqual(
      constants.SI_PAPER,
    );
  });
};
