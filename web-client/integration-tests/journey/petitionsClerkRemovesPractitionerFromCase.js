import { SERVICE_INDICATOR_TYPES } from '../../../shared/src/business/entities/EntityConstants';
import { contactSecondaryFromState } from '../helpers';

export const petitionsClerkRemovesPractitionerFromCase = test => {
  return it('Petitions clerk removes a practitioner from a case', async () => {
    expect(test.getState('caseDetail.privatePractitioners').length).toEqual(2);

    await test.runSequence('openEditPrivatePractitionersModalSequence');

    await test.runSequence('updateModalValueSequence', {
      key: 'privatePractitioners.0.removeFromCase',
      value: true,
    });

    await test.runSequence('submitEditPrivatePractitionersModalSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('caseDetail.privatePractitioners').length).toEqual(1);

    const contactSecondary = contactSecondaryFromState(test);

    expect(contactSecondary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );
  });
};
