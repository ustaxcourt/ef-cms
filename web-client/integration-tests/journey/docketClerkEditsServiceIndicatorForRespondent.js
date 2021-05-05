import { SERVICE_INDICATOR_TYPES } from '../../../shared/src/business/entities/EntityConstants';

export const docketClerkEditsServiceIndicatorForRespondent = test => {
  return it('docket clerk edits service indicator for a respondent', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const barNumber = test.getState('caseDetail.irsPractitioners.0.barNumber');

    await test.runSequence('gotoEditRespondentCounselSequence', {
      barNumber,
      docketNumber: test.docketNumber,
    });

    expect(test.getState('form.serviceIndicator')).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );

    await test.runSequence('updateFormValueSequence', {
      key: 'serviceIndicator',
      value: SERVICE_INDICATOR_TYPES.SI_PAPER,
    });

    expect(
      test.getState('caseDetail.irsPractitioners.0.serviceIndicator'),
    ).toEqual(SERVICE_INDICATOR_TYPES.SI_ELECTRONIC);

    await test.runSequence('submitEditRespondentCounselSequence');

    expect(
      test.getState('caseDetail.irsPractitioners.0.serviceIndicator'),
    ).toEqual(SERVICE_INDICATOR_TYPES.SI_PAPER);
  });
};
