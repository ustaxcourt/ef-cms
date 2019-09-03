export default test => {
  return it('Taxpayer updates primary contact phone', async () => {
    await test.runSequence('updateCaseValueSequence', {
      key: 'contactPrimary.phone',
      value: '9999999999',
    });

    await test.runSequence('submitEditPrimaryContactSequence');

    expect(test.getState('caseDetail.contactPrimary.phone')).toEqual(
      '9999999999',
    );
    expect(test.getState('caseDetail.docketRecord')[3].description).toEqual(
      'Notice of Change of Telephone Number',
    );
  });
};
