export default test => {
  return it('Petitioner updates primary contact information', async () => {
    const contactPrimary = {
      ...test.getState('caseDetail.contactPrimary'),
      address1: '100 Main St.',
      address2: 'Grand View Apartments',
      address3: 'Apt. #104',
      city: 'Jordan',
      countryType: 'domestic',
      phone: '1111111111',
      postalCode: '55352',
      state: 'MN',
    };

    await test.runSequence('updateContactPrimaryValueSequence', {
      key: 'contactPrimary',
      value: contactPrimary,
    });

    await test.runSequence('submitEditPrimaryContactSequence');

    expect(test.getState('caseDetail.contactPrimary')).toEqual(contactPrimary);
    expect(test.getState('caseDetail.docketRecord')[2].description).toEqual(
      'Notice of Change of Address by Test Petitioner',
    );
  });
};
