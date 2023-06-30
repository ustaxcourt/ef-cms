import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkVerifiesConsolidatedCaseIndicatorDocumentQCSection = (
  cerebralTest,
  docketNumber,
  { box, queue },
) => {
  const formattedWorkQueue = withAppContextDecorator(
    formattedWorkQueueComputed,
  );

  return it('docket clerk verifies consolidated case indicator Section Document QC inbox', async () => {
    await refreshElasticsearchIndex();
    await cerebralTest.runSequence('gotoWorkQueueSequence');
    await cerebralTest.runSequence('chooseWorkQueueSequence', {
      box,
      queue,
    });

    const sectionDocumentQCInbox = runCompute(formattedWorkQueue, {
      state: cerebralTest.getState(),
    });

    const foundWorkItem = sectionDocumentQCInbox.find(
      workItem =>
        workItem.docketEntry.docketEntryId === cerebralTest.docketEntryId,
    );

    expect(foundWorkItem).toMatchObject({
      consolidatedIconTooltipText: 'Consolidated case',
      inConsolidatedGroup: true,
      inLeadCase: false,
    });
  });
};
