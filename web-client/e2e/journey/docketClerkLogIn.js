import applicationContext from '../../src/applicationContext';

export default (test, token = 'docketclerk') => {
  it('the docketclerk logs in', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'name',
      value: token,
    });
    await test.runSequence('submitLogInSequence');
    expect(test.getState('user.userId')).toEqual(token);
    expect(applicationContext.getCurrentUser()).toBeDefined();
    expect(applicationContext.getCurrentUser().userId).toEqual(token);
  });
};
