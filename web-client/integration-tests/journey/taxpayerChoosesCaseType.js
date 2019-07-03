export default test => {
  it('taxpayer chooses the case type', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'hasIrsNotice',
      value: true,
    });
    expect(test.getState('form.hasIrsNotice')).toEqual(true);

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
