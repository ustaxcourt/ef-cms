import { applicationContext } from '../../src/applicationContext';
import { wait } from '../helpers';

export default test => {
  return it('petitioner logs in', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'name',
      value: 'petitioner',
    });
    await test.runSequence('submitLoginSequence');
    await wait(2000);
    expect(test.getState('user.userId')).toEqual(
      '7805d1ab-18d0-43ec-bafb-654e83405416',
    );
    expect(applicationContext.getCurrentUser()).toBeDefined();
    expect(applicationContext.getCurrentUser().userId).toEqual(
      '7805d1ab-18d0-43ec-bafb-654e83405416',
    );
  });
};
