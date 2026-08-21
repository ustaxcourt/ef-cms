import { contactPrimaryFromState, contactSecondaryFromState } from '../helpers';

export const petitionsClerkViewsCaseWithSealedContact = (
  cerebralTest,
  contactType,
  docketNumber?,
) => {
  return it(`Petitions clerk views case with sealed ${contactType}`, async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: docketNumber || cerebralTest.docketNumber,
    });

    let sealedContact;
    if (contactType === 'contactPrimary') {
      sealedContact = contactPrimaryFromState(cerebralTest);
    } else if (contactType === 'contactSecondary') {
      sealedContact = contactSecondaryFromState(cerebralTest);
    } else {
      sealedContact = cerebralTest
        .getState(`caseDetail.${contactType}`)
        .find(c => c.isAddressSealed === true);
    }

    expect(sealedContact.isAddressSealed).toBe(true);
    expect(sealedContact.address1).toBe('somewhere over the rainbow');
    expect(sealedContact.phone).toBe('+1 (884) 358-9729');
  });
};
