export default test => {
  it('taxpayer chooses the case type', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: 'noticeOfDeficiency',
    });
    expect(test.getState('form.caseType')).toEqual('noticeOfDeficiency');
  });
};
