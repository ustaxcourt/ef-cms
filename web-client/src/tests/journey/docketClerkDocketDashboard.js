import { runCompute } from 'cerebral/test';

import { formattedWorkQueue } from '../../presenter/computeds/formattedWorkQueue';

export default test => {
  return it('Docket clerk docket work queue dashboard', async () => {
    await test.runSequence('gotoDocketSectionSequence');
    const workQueue = test.getState('workQueue');
    expect(workQueue.length).toBeGreaterThan(2);
    const workItem = workQueue.find(
      workItem =>
        workItem.docketNumber === test.docketNumber &&
        workItem.document.documentType === 'Stipulated Decision',
    );
    expect(workItem).toBeDefined();
    test.documentId = workItem.document.documentId;
    test.workItemId = workItem.workItemId;

    const formatted = runCompute(formattedWorkQueue, {
      state: test.getState(),
    });
    expect(formatted[0].createdAtFormatted).toBeDefined();
    expect(formatted[0].messages[0].createdAtFormatted).toBeDefined();
  });
};
