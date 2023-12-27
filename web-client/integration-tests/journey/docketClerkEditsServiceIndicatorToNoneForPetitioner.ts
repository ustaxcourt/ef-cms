import { SERVICE_INDICATOR_TYPES } from '../../../shared/src/business/entities/EntityConstants';
import { contactSecondaryFromState } from '../helpers';

export const docketClerkEditsServiceIndicatorToNoneForPetitioner =
  cerebralTest => {
    return it('docket clerk edits service indicator for a petitioner', async () => {
      let contact = contactSecondaryFromState(cerebralTest);

      await cerebralTest.runSequence(
        'gotoEditPetitionerInformationInternalSequence',
        {
          contactId: contact.contactId,
          docketNumber: cerebralTest.docketNumber,
        },
      );

      await cerebralTest.runSequence('updateFormValueSequence', {
        key: 'contact.serviceIndicator',
        value: SERVICE_INDICATOR_TYPES.SI_NONE,
      });

      await cerebralTest.runSequence('submitEditPetitionerSequence');
    });
  };
