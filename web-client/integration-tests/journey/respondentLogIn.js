export default (test, token = 'respondent') => {
  return it('Respondent logs in', async () => {
    await test.runSequence('gotoLoginSequence');
    await test.runSequence('updateFormValueSequence', {
      key: 'name',
      value: token,
    });
    await test.runSequence('submitLoginSequence');
  });
};
