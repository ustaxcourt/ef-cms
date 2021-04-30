import { SERVICE_INDICATOR_TYPES } from '../../../shared/src/business/entities/EntityConstants';
import { contactPrimaryFromState } from '../helpers';

export const docketClerkAddsPetitionerToCase = test => {
  return it('docket clerk adds new petitioner to case', async () => {
    const petitionersBeforeAdding = test.getState('caseDetail.petitioners')
      .length;

    await test.runSequence('gotoAddPetitionerToCaseSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.name',
      value: 'A New Petitioner',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.additionalName',
      value: 'A Petitioner Additional Name',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.phone',
      value: '6126788888',
    });

    const contactPrimary = contactPrimaryFromState(test);

    await test.runSequence('setSelectedAddressOnFormSequence', {
      contactId: contactPrimary.contactId,
    });

    const mockUpdatedCaption = 'Something Else';

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.caseCaption',
      value: mockUpdatedCaption,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.serviceIndicator',
      value: SERVICE_INDICATOR_TYPES.SI_PAPER,
    });

    await test.runSequence('submitAddPetitionerSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('caseDetail.petitioners').length).toEqual(
      petitionersBeforeAdding + 1,
    );

    expect(test.getState('caseDetail.caseCaption')).toEqual(mockUpdatedCaption);
  });
};
