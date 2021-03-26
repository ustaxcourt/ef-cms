const {
  contactPrimaryFromState,
  contactSecondaryFromState,
} = require('../helpers');

export const docketClerkSealsContactInformation = (
  test,
  contactType,
  docketNumber,
) => {
  return it(`Docket clerk seals ${contactType} information`, async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: docketNumber || test.docketNumber,
    });

    let contactToSeal;

    if (contactType === 'contactPrimary') {
      contactToSeal = contactPrimaryFromState(test);
    } else if (contactType === 'contactSecondary') {
      contactToSeal = contactSecondaryFromState(test);
    } else {
      contactToSeal = test
        .getState(`caseDetail.${contactType}`)
        .find(contact => contact.isAddressSealed === false);
    }

    expect(contactToSeal.isAddressSealed).toBe(false);

    await test.runSequence('openSealAddressModalSequence', { contactToSeal });

    expect(test.getState('contactToSeal')).toEqual(contactToSeal);
    expect(test.getState('modal.showModal')).toEqual('SealAddressModal');

    await test.runSequence('sealAddressSequence');

    expect(test.getState('modal.showModal')).toBeUndefined();
    expect(test.getState('alertSuccess.message')).toEqual(
      `Address sealed for ${contactToSeal.name}.`,
    );

    if (contactType === 'contactPrimary') {
      contactToSeal = contactPrimaryFromState(test);
    } else if (contactType === 'contactSecondary') {
      contactToSeal = contactSecondaryFromState(test);
    } else {
      contactToSeal = test
        .getState(`caseDetail.${contactType}`)
        .find(c => c.contactId === contactToSeal.contactId);
    }

    expect(contactToSeal.isAddressSealed).toBe(true);
  });
};
