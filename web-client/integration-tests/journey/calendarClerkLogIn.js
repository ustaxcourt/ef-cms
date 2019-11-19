import { applicationContext } from '../../src/applicationContext';
import { userMap } from '../../../shared/src/test/mockUserTokenMap';

export default (test, token = 'calendarclerk') => {
  it('the calendarclerk logs in', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'name',
      value: token,
    });
    await test.runSequence('submitLoginSequence');
    expect(test.getState('user.userId')).toEqual(userMap[token].userId);
    expect(applicationContext.getCurrentUser()).toBeDefined();
    expect(applicationContext.getCurrentUser().userId).toEqual(
      userMap[token].userId,
    );
  });
};
