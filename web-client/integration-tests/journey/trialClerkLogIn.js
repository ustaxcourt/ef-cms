import { wait } from '../helpers';

export default (test, name = 'trialclerk') => {
  return it('Trial Clerk logs in', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'name',
      value: name,
    });
    await test.runSequence('submitLoginSequence');
  });
};
