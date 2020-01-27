import { constants } from '../../../shared/src/business/utilities/setServiceIndicatorsForCase';

export default test => {
  return it('docket clerk edits service indicator for a petitioner', async () => {
    await test.runSequence('gotoEditPetitionerInformationSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('form.contactPrimary.serviceIndicator')).toEqual(
      constants.SI_NONE,
    );

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.serviceIndicator',
      value: constants.SI_ELECTRONIC,
    });

    await test.runSequence('updatePetitionerInformationFormSequence');
    expect(test.getState('validationErrors')).toMatchObject({
      contactPrimary: {
        serviceIndicator: expect.anything(),
      },
    });

    expect(test.getState('caseDetail.contactPrimary.serviceIndicator')).toEqual(
      constants.SI_NONE,
    );

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.serviceIndicator',
      value: constants.SI_PAPER,
    });

    await test.runSequence('updatePetitionerInformationFormSequence');

    expect(test.getState('caseDetail.contactPrimary.serviceIndicator')).toEqual(
      constants.SI_PAPER,
    );
  });
};
