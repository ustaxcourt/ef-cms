import { SERVICE_INDICATOR_TYPES } from '../../../shared/src/business/entities/EntityConstants';

export const docketClerkEditsServiceIndicatorForPetitioner = test => {
  return it('docket clerk edits service indicator for a petitioner', async () => {
    await test.runSequence('gotoEditPetitionerInformationSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('form.contactPrimary.serviceIndicator')).toEqual(
      SERVICE_INDICATOR_TYPES.SI_NONE,
    );

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.serviceIndicator',
      value: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    });

    await test.runSequence('updatePetitionerInformationFormSequence');
    expect(test.getState('validationErrors')).toMatchObject({
      contactPrimary: {
        serviceIndicator: expect.anything(),
      },
    });

    expect(test.getState('caseDetail.contactPrimary.serviceIndicator')).toEqual(
      SERVICE_INDICATOR_TYPES.SI_NONE,
    );

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.serviceIndicator',
      value: SERVICE_INDICATOR_TYPES.SI_PAPER,
    });

    await test.runSequence('updatePetitionerInformationFormSequence');

    expect(test.getState('caseDetail.contactPrimary.serviceIndicator')).toEqual(
      SERVICE_INDICATOR_TYPES.SI_PAPER,
    );
  });
};
