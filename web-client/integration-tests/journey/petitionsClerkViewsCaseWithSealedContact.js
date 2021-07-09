const {
  contactPrimaryFromState,
  contactSecondaryFromState,
} = require('../helpers');

export const petitionsClerkViewsCaseWithSealedContact = (
  cerebralTest,
  contactType,
  docketNumber,
) => {
  return it(`Petitions clerk views case with sealed ${contactType}`, async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: docketNumber || cerebralTest.docketNumber,
    });

    let sealedContact;
    if (contactType === 'contactPrimary') {
      sealedContact = contactPrimaryFromState(test);
    } else if (contactType === 'contactSecondary') {
      sealedContact = contactSecondaryFromState(test);
    } else {
      sealedContact = test
        .getState(`caseDetail.${contactType}`)
        .find(c => c.isAddressSealed === true);
    }

    expect(sealedContact.isAddressSealed).toBe(true);
    expect(sealedContact.address1).toBeUndefined();
    expect(sealedContact.phone).toBeUndefined();
  });
};
