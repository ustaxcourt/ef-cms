import applicationContext from '../../src/applicationContext';

export default test => {
  return it('Taxpayer logs in', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'name',
      value: 'taxpayer',
    });
    await test.runSequence('submitLogInSequence');
    expect(test.getState('user.userId')).toEqual('taxpayer');
    expect(applicationContext.getCurrentUser()).toBeDefined();
    expect(applicationContext.getCurrentUser().userId).toEqual('taxpayer');
  });
};
