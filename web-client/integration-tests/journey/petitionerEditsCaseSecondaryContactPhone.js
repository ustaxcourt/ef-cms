export default test => {
  return it('petitioner updates secondary contact phone', async () => {
    await test.runSequence('updateCaseValueSequence', {
      key: 'contactSecondary.phone',
      value: '9999999999',
    });

    await test.runSequence('submitEditSecondaryContactSequence');

    expect(test.getState('caseDetail.contactSecondary.phone')).toEqual(
      '9999999999',
    );
    expect(test.getState('caseDetail.docketRecord')[3].description).toEqual(
      'Notice of Change of Telephone Number',
    );
  });
};
