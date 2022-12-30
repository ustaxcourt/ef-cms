import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkVerifiesConsolidatedLeadCaseIndicatorDocumentQCSection =
  (cerebralTest, docketNumber, { box, queue }) => {
    const formattedWorkQueue = withAppContextDecorator(
      formattedWorkQueueComputed,
    );

    return it('docket clerk verifies lead case indicator Section Document QC', async () => {
      await refreshElasticsearchIndex();
      // await cerebralTest.runSequence('gotoWorkQueueSequence');
      await cerebralTest.runSequence('gotoWorkQueueSequence', {
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
        consolidatedIconTooltipText: 'Lead case',
        inConsolidatedGroup: true,
        inLeadCase: true,
      });
    });
  };
