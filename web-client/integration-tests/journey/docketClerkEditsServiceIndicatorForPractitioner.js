import { SERVICE_INDICATOR_TYPES } from '../../../shared/src/business/entities/EntityConstants';

export const docketClerkEditsServiceIndicatorForPractitioner = cerebralTest => {
  return it('docket clerk edits service indicator for a practitioner', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const barNumber = cerebralTest.getState(
      'caseDetail.privatePractitioners.0.barNumber',
    );

    await cerebralTest.runSequence('gotoEditPetitionerCounselSequence', {
      barNumber,
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('validationErrors')).toEqual({});
    expect(cerebralTest.getState('currentPage')).toEqual(
      'EditPetitionerCounsel',
    );

    expect(cerebralTest.getState('form.serviceIndicator')).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'serviceIndicator',
      value: SERVICE_INDICATOR_TYPES.SI_PAPER,
    });

    expect(
      cerebralTest.getState(
        'caseDetail.privatePractitioners.0.serviceIndicator',
      ),
    ).toEqual(SERVICE_INDICATOR_TYPES.SI_ELECTRONIC);

    await cerebralTest.runSequence('submitEditPetitionerCounselSequence');

    expect(
      cerebralTest.getState(
        'caseDetail.privatePractitioners.0.serviceIndicator',
      ),
    ).toEqual(SERVICE_INDICATOR_TYPES.SI_PAPER);
  });
};
