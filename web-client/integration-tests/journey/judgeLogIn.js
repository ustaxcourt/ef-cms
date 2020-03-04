import { wait } from '../helpers';

export default (test, name = 'judgeArmen') => {
  return it('Judge logs in', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'name',
      value: name,
    });
    await test.runSequence('submitLoginSequence');
  });
};
