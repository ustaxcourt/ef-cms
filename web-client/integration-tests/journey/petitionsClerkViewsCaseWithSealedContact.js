const {
  contactPrimaryFromState,
  contactSecondaryFromState,
} = require('../helpers');

export const petitionsClerkViewsCaseWithSealedContact = (
  test,
  contactType,
  docketNumber,
) => {
  return it(`Petitions clerk views case with sealed ${contactType}`, async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: docketNumber || test.docketNumber,
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
