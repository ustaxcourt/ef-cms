import { SERVICE_INDICATOR_TYPES } from '../../../shared/src/business/entities/cases/CaseConstants';

export default test => {
  return it('docket clerk edits service indicator for a practitioner', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('openEditPractitionersModalSequence');

    expect(test.getState('modal.practitioners.0.serviceIndicator')).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );

    await test.runSequence('updateModalValueSequence', {
      key: 'practitioners.0.serviceIndicator',
      value: SERVICE_INDICATOR_TYPES.SI_PAPER,
    });

    expect(
      test.getState('caseDetail.practitioners.0.serviceIndicator'),
    ).toEqual(SERVICE_INDICATOR_TYPES.SI_ELECTRONIC);

    await test.runSequence('submitEditPractitionersModalSequence');

    expect(
      test.getState('caseDetail.practitioners.0.serviceIndicator'),
    ).toEqual(SERVICE_INDICATOR_TYPES.SI_PAPER);
  });
};
