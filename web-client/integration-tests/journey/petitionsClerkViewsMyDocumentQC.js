import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';
import { workQueueHelper as workQueueHelperComputed } from '../../src/presenter/computeds/workQueueHelper';

const workQueueHelper = withAppContextDecorator(workQueueHelperComputed);

export const petitionsClerkViewsMyDocumentQC = (cerebralTest, storeCount) => {
  return it('Petitions clerk views My Document QC', async () => {
    await cerebralTest.runSequence('navigateToPathSequence', {
      path: '/document-qc/my/inbox',
    });
    const workQueueToDisplay = cerebralTest.getState('workQueueToDisplay');

    expect(workQueueToDisplay.queue).toEqual('my');
    expect(workQueueToDisplay.box).toEqual('inbox');

    if (storeCount) {
      const helper = await runCompute(workQueueHelper, {
        state: cerebralTest.getState(),
      });
      cerebralTest.petitionsClerkMyDocumentQCInboxCount =
        helper.individualInboxCount;
    }
  });
};
