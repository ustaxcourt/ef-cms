import { SERVICE_INDICATOR_TYPES } from '../../../shared/src/business/entities/EntityConstants';
import { contactPrimaryFromState } from '../helpers';

export const docketClerkEditsServiceIndicatorForPetitioner = (
  test,
  expectedServiceIndicator = null,
) => {
  return it('docket clerk edits service indicator for a petitioner', async () => {
    let contactPrimary = contactPrimaryFromState(test);

    await test.runSequence('gotoEditPetitionerInformationInternalSequence', {
      contactId: contactPrimary.contactId,
      docketNumber: test.docketNumber,
    });

    expect(test.getState('form.contact.serviceIndicator')).toEqual(
      expectedServiceIndicator || SERVICE_INDICATOR_TYPES.SI_NONE,
    );

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.serviceIndicator',
      value: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    });

    if (!expectedServiceIndicator) {
      await test.runSequence('submitEditPetitionerSequence');
      expect(test.getState('validationErrors')).toMatchObject({
        contact: {
          serviceIndicator: expect.anything(),
        },
      });

      const contactPrimaryResult = contactPrimaryFromState(test);

      expect(contactPrimaryResult.serviceIndicator).toEqual(
        SERVICE_INDICATOR_TYPES.SI_NONE,
      );
    }

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.serviceIndicator',
      value: SERVICE_INDICATOR_TYPES.SI_PAPER,
    });

    await test.runSequence('submitEditPetitionerSequence');

    contactPrimary = contactPrimaryFromState(test);

    expect(contactPrimary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_PAPER,
    );
  });
};
