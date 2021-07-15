import {
  CONTACT_TYPES,
  SERVICE_INDICATOR_TYPES,
} from '../../../shared/src/business/entities/EntityConstants';
import { contactPrimaryFromState } from '../helpers';

export const docketClerkAddsPetitionerToCase = (
  cerebralTest,
  overrides = {},
) => {
  return it('docket clerk adds new petitioner to case', async () => {
    const petitionersBeforeAdding = cerebralTest.getState(
      'caseDetail.petitioners',
    ).length;

    await cerebralTest.runSequence('gotoAddPetitionerToCaseSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.contactType',
      value: overrides.contactType || CONTACT_TYPES.otherPetitioner,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.name',
      value: overrides.name || 'A New Petitioner',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.additionalName',
      value: 'A Petitioner Additional Name',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.phone',
      value: '6126788888',
    });

    const contactPrimary = contactPrimaryFromState(cerebralTest);

    await cerebralTest.runSequence('setSelectedAddressOnFormSequence', {
      contactId: contactPrimary.contactId,
    });

    const mockUpdatedCaption = 'Something Else';

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.caseCaption',
      value: mockUpdatedCaption,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.serviceIndicator',
      value: SERVICE_INDICATOR_TYPES.SI_PAPER,
    });

    await cerebralTest.runSequence('submitAddPetitionerSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('caseDetail.petitioners').length).toEqual(
      petitionersBeforeAdding + 1,
    );

    expect(cerebralTest.getState('caseDetail.caseCaption')).toEqual(
      mockUpdatedCaption,
    );

    if (overrides.contactType === 'intervenor') {
      cerebralTest.intervenorContactId = cerebralTest
        .getState('caseDetail.petitioners')
        .find(p => p.contactType === CONTACT_TYPES.intervenor).contactId;
    }
  });
};
