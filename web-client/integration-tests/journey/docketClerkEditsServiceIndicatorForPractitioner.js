import { SERVICE_INDICATOR_TYPES } from '../../../shared/src/business/entities/EntityConstants';

export const docketClerkEditsServiceIndicatorForPractitioner = test => {
  return it('docket clerk edits service indicator for a practitioner', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const barNumber = test.getState(
      'caseDetail.privatePractitioners.0.barNumber',
    );

    await test.runSequence('gotoEditPetitionerCounselSequence', {
      barNumber,
      docketNumber: test.docketNumber,
    });

    expect(test.getState('validationErrors')).toEqual({});
    expect(test.getState('currentPage')).toEqual('EditPetitionerCounsel');

    expect(test.getState('form.serviceIndicator')).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );

    await test.runSequence('updateFormValueSequence', {
      key: 'serviceIndicator',
      value: SERVICE_INDICATOR_TYPES.SI_PAPER,
    });

    expect(
      test.getState('caseDetail.privatePractitioners.0.serviceIndicator'),
    ).toEqual(SERVICE_INDICATOR_TYPES.SI_ELECTRONIC);

    await test.runSequence('submitEditPetitionerCounselSequence');

    expect(
      test.getState('caseDetail.privatePractitioners.0.serviceIndicator'),
    ).toEqual(SERVICE_INDICATOR_TYPES.SI_PAPER);
  });
};
