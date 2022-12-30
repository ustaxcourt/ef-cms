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
      await cerebralTest.runSequence('gotoWorkQueueSequence');
      await cerebralTest.runSequence('chooseWorkQueueSequence', {
        box,
        queue,
      });

      const sectionDocumentQCInbox = runCompute(formattedWorkQueue, {
        state: cerebralTest.getState(),
      });

      console.log('cerebralTest.docketEntryId', cerebralTest.docketEntryId);
      const foundWorkItem = sectionDocumentQCInbox.find(
        workItem =>
          workItem.docketEntry.docketEntryId === cerebralTest.docketEntryId,
      );
      console.log('foundWorkItem', foundWorkItem);

      expect(foundWorkItem).toMatchObject({
        consolidatedIconTooltipText: 'Lead case',
        inConsolidatedGroup: true,
        inLeadCase: true,
      });
    });
  };
