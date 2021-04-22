import { contactPrimaryFromState } from '../helpers';

export const docketClerkAddsPetitionerToCase = test => {
  return it('docket clerk adds new petitioner to case', async () => {
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

    const contactPrimary = contactPrimaryFromState(test);

    await test.runSequence('setSelectedAddressOnFormSequence', {
      contactId: contactPrimary.contactId,
    });
  });
};
