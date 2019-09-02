import { runCompute } from 'cerebral/test';
import { workQueueHelper } from '../../src/presenter/computeds/workQueueHelper';

export default (test, storeCount) => {
  return it('Petitions clerk views Section Document QC', async () => {
    await test.runSequence('navigateToPathSequence', {
      path: '/document-qc/section/inbox',
    });
    const workQueueToDisplay = test.getState('workQueueToDisplay');
    const workQueueIsMessages = test.getState('workQueueIsMessages');

    expect(workQueueIsMessages).toBeFalsy();
    expect(workQueueToDisplay.queue).toEqual('section');
    expect(workQueueToDisplay.box).toEqual('inbox');

    if (storeCount) {
      const helper = await runCompute(workQueueHelper, {
        state: test.getState(),
      });
      test.petitionsClerkSectionDocumentQCInboxCount = helper.inboxCount;
    }
  });
};
