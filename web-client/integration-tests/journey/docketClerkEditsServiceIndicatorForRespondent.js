import { SERVICE_INDICATOR_TYPES } from '../../../shared/src/business/entities/EntityConstants';

export const docketClerkEditsServiceIndicatorForRespondent = test => {
  return it('docket clerk edits service indicator for a respondent', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('openEditIrsPractitionersModalSequence');

    expect(test.getState('modal.irsPractitioners.0.serviceIndicator')).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );

    await test.runSequence('updateModalValueSequence', {
      key: 'irsPractitioners.0.serviceIndicator',
      value: SERVICE_INDICATOR_TYPES.SI_PAPER,
    });

    expect(
      test.getState('caseDetail.irsPractitioners.0.serviceIndicator'),
    ).toEqual(SERVICE_INDICATOR_TYPES.SI_ELECTRONIC);

    await test.runSequence('submitEditIrsPractitionersModalSequence');

    expect(
      test.getState('caseDetail.irsPractitioners.0.serviceIndicator'),
    ).toEqual(SERVICE_INDICATOR_TYPES.SI_PAPER);
  });
};
