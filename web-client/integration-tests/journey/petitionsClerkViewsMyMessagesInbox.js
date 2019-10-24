import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';
import { workQueueHelper as workQueueHelperComputed } from '../../src/presenter/computeds/workQueueHelper';

const workQueueHelper = withAppContextDecorator(workQueueHelperComputed);

export default (test, storeCount) => {
  return it('Petitions clerk views My Messages Inbox', async () => {
    await test.runSequence('navigateToPathSequence', {
      path: '/messages/my/inbox',
    });
    const workQueueToDisplay = test.getState('workQueueToDisplay');

    expect(workQueueToDisplay.workQueueIsInternal).toBeTruthy();
    expect(workQueueToDisplay.queue).toEqual('my');
    expect(workQueueToDisplay.box).toEqual('inbox');

    if (storeCount) {
      const helper = await runCompute(workQueueHelper, {
        state: test.getState(),
      });
      test.petitionsClerkMyMessagesInboxCount = helper.inboxCount;
    }
  });
};
