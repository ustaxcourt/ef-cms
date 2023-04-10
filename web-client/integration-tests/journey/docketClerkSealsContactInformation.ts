const {
  contactPrimaryFromState,
  contactSecondaryFromState,
} = require('../helpers');

export const docketClerkSealsContactInformation = (
  cerebralTest,
  contactType,
  docketNumber,
) => {
  return it(`Docket clerk seals ${contactType} information`, async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: docketNumber || cerebralTest.docketNumber,
    });

    let contactToSeal;

    if (contactType === 'contactPrimary') {
      contactToSeal = contactPrimaryFromState(cerebralTest);
    } else if (contactType === 'contactSecondary') {
      contactToSeal = contactSecondaryFromState(cerebralTest);
    } else {
      contactToSeal = cerebralTest
        .getState(`caseDetail.${contactType}`)
        .find(contact => contact.isAddressSealed === false);
    }

    expect(contactToSeal.isAddressSealed).toBe(false);

    await cerebralTest.runSequence('openSealAddressModalSequence', {
      contactToSeal,
    });

    expect(cerebralTest.getState('contactToSeal')).toEqual(contactToSeal);
    expect(cerebralTest.getState('modal.showModal')).toEqual(
      'SealAddressModal',
    );

    await cerebralTest.runSequence('sealAddressSequence');

    expect(cerebralTest.getState('modal.showModal')).toBeUndefined();
    expect(cerebralTest.getState('alertSuccess.message')).toEqual(
      `Address sealed for ${contactToSeal.name}.`,
    );

    if (contactType === 'contactPrimary') {
      contactToSeal = contactPrimaryFromState(cerebralTest);
    } else if (contactType === 'contactSecondary') {
      contactToSeal = contactSecondaryFromState(cerebralTest);
    } else {
      contactToSeal = cerebralTest
        .getState(`caseDetail.${contactType}`)
        .find(c => c.contactId === contactToSeal.contactId);
    }

    expect(contactToSeal.isAddressSealed).toBe(true);
  });
};
