import { SERVICE_INDICATOR_TYPES } from '../../../shared/src/business/entities/EntityConstants';

export const docketClerkEditsServiceIndicatorForRespondent = cerebralTest => {
  return it('docket clerk edits service indicator for a respondent', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const barNumber = cerebralTest.getState(
      'caseDetail.irsPractitioners.0.barNumber',
    );

    await cerebralTest.runSequence('gotoEditRespondentCounselSequence', {
      barNumber,
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('form.serviceIndicator')).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'serviceIndicator',
      value: SERVICE_INDICATOR_TYPES.SI_PAPER,
    });

    expect(
      cerebralTest.getState('caseDetail.irsPractitioners.0.serviceIndicator'),
    ).toEqual(SERVICE_INDICATOR_TYPES.SI_ELECTRONIC);

    await cerebralTest.runSequence('submitEditRespondentCounselSequence');

    expect(
      cerebralTest.getState('caseDetail.irsPractitioners.0.serviceIndicator'),
    ).toEqual(SERVICE_INDICATOR_TYPES.SI_PAPER);
  });
};
