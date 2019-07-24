export default test => {
  return it('the seniorattorney logs in', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'name',
      value: 'seniorattorney',
    });
    await test.runSequence('submitLoginSequence');
  });
};
