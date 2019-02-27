export default test => {
  return it('Respondent logs in', async () => {
    await test.runSequence('gotoLoginSequence');
    await test.runSequence('updateFormValueSequence', {
      key: 'name',
      value: 'respondent',
    });
    await test.runSequence('submitLoginSequence');
  });
};
