export default test => {
  return it('Petitions clerk logs in', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'name',
      value: 'petitionsclerk',
    });
    await test.runSequence('submitLogInSequence');
  });
};
