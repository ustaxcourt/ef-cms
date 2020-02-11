export default test => {
  return it('petitioner updates secondary contact address', async () => {
    await test.runSequence('updateCaseValueSequence', {
      key: 'contactSecondary.address1',
      value: '100 Main St.',
    });

    await test.runSequence('updateCaseValueSequence', {
      key: 'contactSecondary.address2',
      value: 'Grand View Apartments',
    });

    await test.runSequence('updateCaseValueSequence', {
      key: 'contactSecondary.address3',
      value: 'Apt. 104',
    });

    await test.runSequence('submitEditSecondaryContactSequence');

    expect(test.getState('caseDetail.contactSecondary.address1')).toEqual(
      '100 Main St.',
    );
    expect(test.getState('caseDetail.contactSecondary.address2')).toEqual(
      'Grand View Apartments',
    );
    expect(test.getState('caseDetail.contactSecondary.address3')).toEqual(
      'Apt. 104',
    );
    expect(test.getState('caseDetail.docketRecord')[2].description).toEqual(
      'Notice of Change of Address',
    );
  });
};
