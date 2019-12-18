export default test => {
  it('petitioner chooses the case type', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'hasIrsNotice',
      value: true,
    });
    expect(test.getState('form.hasIrsNotice')).toEqual(true);

    await test.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: 'CDP (Lien/Levy)',
    });
    expect(test.getState('form.caseType')).toEqual('CDP (Lien/Levy)');

    await test.runSequence('updateFormValueSequence', {
      key: 'filingType',
      value: 'Myself',
    });
    expect(test.getState('form.filingType')).toEqual('Myself');
  });
};
