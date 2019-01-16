export default test => {
  it('taxpayer chooses the case type', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: 'Whistleblower',
    });
    expect(test.getState('form.caseType')).toEqual('Whistleblower');
  });
};
