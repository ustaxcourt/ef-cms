export const docketClerkSealsContactPrimaryInformation = test => {
  return it('Docketclerk seals a case contact', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const contactToSeal = test.getState('caseDetail.contactPrimary');
    expect(contactToSeal.isAddressSealed).toBe(false);

    await test.runSequence('openSealAddressModalSequence', { contactToSeal });

    expect(test.getState('contactToSeal')).toEqual(contactToSeal);
    expect(test.getState('modal.showModal')).toEqual('SealAddressModal');

    await test.runSequence('sealAddressSequence');

    expect(test.getState('modal.showModal')).toBeUndefined();
    expect(test.getState('alertSuccess.message')).toEqual(
      `Address sealed for ${contactToSeal.name}.`,
    );

    expect(test.getState('caseDetail.contactPrimary.isAddressSealed')).toBe(
      true,
    );
  });
};
