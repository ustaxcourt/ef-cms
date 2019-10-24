export default test => {
  return it('petitioner updates primary contact address', async () => {
    await test.runSequence('updateCaseValueSequence', {
      key: 'contactPrimary.address1',
      value: '100 Main St.',
    });

    await test.runSequence('updateCaseValueSequence', {
      key: 'contactPrimary.address2',
      value: 'Grand View Apartments',
    });

    await test.runSequence('updateCaseValueSequence', {
      key: 'contactPrimary.address3',
      value: 'Apt. 104',
    });

    await test.runSequence('submitEditPrimaryContactSequence');

    expect(test.getState('caseDetail.contactPrimary.address1')).toEqual(
      '100 Main St.',
    );
    expect(test.getState('caseDetail.contactPrimary.address2')).toEqual(
      'Grand View Apartments',
    );
    expect(test.getState('caseDetail.contactPrimary.address3')).toEqual(
      'Apt. 104',
    );
    expect(test.getState('caseDetail.docketRecord')[2].description).toEqual(
      'Notice of Change of Address',
    );
  });
};
