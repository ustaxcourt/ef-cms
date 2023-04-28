import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkVerifiesConsolidatedGroupInformationForDocumentQC = (
  cerebralTest,
  { box, queue },
) => {
  const formattedWorkQueue = withAppContextDecorator(
    formattedWorkQueueComputed,
  );

  return it('Docket clerk verifies consolidation group information for document qc', async () => {
    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('gotoWorkQueueSequence', {
      box,
      queue,
    });

    const sectionDocumentQCInbox = runCompute(formattedWorkQueue, {
      state: cerebralTest.getState(),
    });

    const foundWorkItem = sectionDocumentQCInbox.find(workItem => {
      return (
        workItem.docketEntry.docketEntryId === cerebralTest.docketEntryId &&
        workItem.docketEntry.docketNumber === cerebralTest.docketNumber
      );
    });

    expect(foundWorkItem).toMatchObject({
      consolidatedIconTooltipText: 'Lead case',
      inConsolidatedGroup: true,
      inLeadCase: true,
    });
  });
};
