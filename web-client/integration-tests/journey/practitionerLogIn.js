import { wait } from '../helpers';

export default (test, token = 'practitioner') => {
  return it('Practitioner logs in', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'name',
      value: token,
    });
    await test.runSequence('submitLoginSequence');
  });
};
