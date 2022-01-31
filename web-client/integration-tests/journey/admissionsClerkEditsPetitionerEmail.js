import { SERVICE_INDICATOR_TYPES } from '../../../shared/src/business/entities/EntityConstants';
import {
  contactPrimaryFromState,
  contactSecondaryFromState,
  refreshElasticsearchIndex,
} from '../helpers';

export const admissionsClerkEditsPetitionerEmail = (
  cerebralTest,
  emailToAdd,
  editSecondary = false,
) => {
  return it('admissions clerk adds petitioner email with existing cognito account to case', async () => {
    await refreshElasticsearchIndex();

    let contact = editSecondary
      ? contactSecondaryFromState(cerebralTest)
      : contactPrimaryFromState(cerebralTest);

    await cerebralTest.runSequence(
      'gotoEditPetitionerInformationInternalSequence',
      {
        contactId: contact.contactId,
        docketNumber: cerebralTest.docketNumber,
      },
    );

    expect(cerebralTest.getState('currentPage')).toEqual(
      'EditPetitionerInformationInternal',
    );
    expect(cerebralTest.getState('form.updatedEmail')).toBeUndefined();
    expect(cerebralTest.getState('form.confirmEmail')).toBeUndefined();

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.updatedEmail',
      value: emailToAdd,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.confirmEmail',
      value: emailToAdd,
    });

    await cerebralTest.runSequence('submitEditPetitionerSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('modal.showModal')).toBe(
      'MatchingEmailFoundModal',
    );
    expect(cerebralTest.getState('currentPage')).toEqual(
      'EditPetitionerInformationInternal',
    );

    await cerebralTest.runSequence(
      'submitUpdatePetitionerInformationFromModalSequence',
    );

    expect(cerebralTest.getState('modal.showModal')).toBeUndefined();
    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');

    contact = editSecondary
      ? contactSecondaryFromState(cerebralTest)
      : contactPrimaryFromState(cerebralTest);

    expect(contact.email).toEqual(emailToAdd);
    expect(contact.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );

    await refreshElasticsearchIndex();
  });
};
