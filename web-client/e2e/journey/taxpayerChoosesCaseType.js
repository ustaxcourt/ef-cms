export default test => {
  it('taxpayer chooses the case type', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'hasNotice',
      value: true,
    });
    expect(test.getState('form.hasNotice')).toEqual(true);

    await test.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: 'Whistleblower',
    });
    expect(test.getState('form.caseType')).toEqual('Whistleblower');

    await test.runSequence('updateFormValueSequence', {
      key: 'filingType',
      value: 'Myself',
    });
    expect(test.getState('form.filingType')).toEqual('Myself');
  });
};
