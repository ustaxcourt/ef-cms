import { flushPromises, wait } from '../helpers';

export default test => {
  return it('Petitions Clerk Sets A Trial Sessions Schedule', async () => {
    await test.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: test.trialSessionId,
    });
    const thisTest = {}; // FIXME: rename this?
    const thisPromise = new Promise(resolve => (thisTest.resolve = resolve));
    test.socketMessageCallback = thisTest.resolve;
    await test.runSequence('setTrialSessionCalendarSequence');
    await thisPromise;
    await flushPromises();
  });
};
