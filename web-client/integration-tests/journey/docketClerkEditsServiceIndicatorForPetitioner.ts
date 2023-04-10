import { SERVICE_INDICATOR_TYPES } from '../../../shared/src/business/entities/EntityConstants';
import { contactPrimaryFromState } from '../helpers';

export const docketClerkEditsServiceIndicatorForPetitioner = (
  cerebralTest,
  expectedServiceIndicator = null,
) => {
  return it('docket clerk edits service indicator for a petitioner', async () => {
    let contactPrimary = contactPrimaryFromState(cerebralTest);

    await cerebralTest.runSequence(
      'gotoEditPetitionerInformationInternalSequence',
      {
        contactId: contactPrimary.contactId,
        docketNumber: cerebralTest.docketNumber,
      },
    );

    expect(cerebralTest.getState('form.contact.serviceIndicator')).toEqual(
      expectedServiceIndicator || SERVICE_INDICATOR_TYPES.SI_NONE,
    );

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.serviceIndicator',
      value: SERVICE_INDICATOR_TYPES.SI_PAPER,
    });

    await cerebralTest.runSequence('submitEditPetitionerSequence');

    contactPrimary = contactPrimaryFromState(cerebralTest);

    expect(contactPrimary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_PAPER,
    );
  });
};
