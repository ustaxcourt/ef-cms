import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkVerifiesConsolidatedLeadCaseIndicatorDocumentQCSectionInbox =
  (cerebralTest, docketNumber) => {
    const formattedWorkQueue = withAppContextDecorator(
      formattedWorkQueueComputed,
    );

    return it('docket clerk verifies lead case indicator Section Document QC inbox', async () => {
      await refreshElasticsearchIndex();
      await cerebralTest.runSequence('gotoWorkQueueSequence');
      await cerebralTest.runSequence('chooseWorkQueueSequence', {
        box: 'inbox',
        queue: 'section',
      });

      const sectionDocumentQCInbox = runCompute(formattedWorkQueue, {
        state: cerebralTest.getState(),
      });

      const foundWorkItem = sectionDocumentQCInbox.find(
        workItem => workItem.docketNumber === docketNumber,
      );

      expect(foundWorkItem).toMatchObject({
        consolidatedIconTooltipText: 'Lead case',
        inConsolidatedGroup: true,
        inLeadCase: true,
      });
    });
  };
