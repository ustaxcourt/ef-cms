import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed);

export const petitionsClerkAddsDocketEntryForOrderAndSavesForLater =
  cerebralTest => {
    return it('Petitions clerk adds docket entry for order and saves for later', async () => {
      await cerebralTest.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
        docketEntryId: cerebralTest.docketEntryId,
        docketNumber: cerebralTest.docketNumber,
      });

      expect(cerebralTest.getState('currentPage')).toEqual(
        'CourtIssuedDocketEntry',
      );
      expect(cerebralTest.getState('form.freeText')).toEqual(
        cerebralTest.freeText,
      );

      await cerebralTest.runSequence('submitCourtIssuedDocketEntrySequence');

      expect(cerebralTest.getState('validationErrors')).toEqual({});

      expect(cerebralTest.getState('currentPage')).toEqual(
        'CaseDetailInternal',
      );

      await refreshElasticsearchIndex();

      await cerebralTest.runSequence('gotoWorkQueueSequence');
      expect(cerebralTest.getState('currentPage')).toEqual('WorkQueue');
      await cerebralTest.runSequence('chooseWorkQueueSequence', {
        box: 'inProgress',
        queue: 'my',
      });

      const workQueueToDisplay = cerebralTest.getState('workQueueToDisplay');

      expect(workQueueToDisplay.queue).toEqual('my');
      expect(workQueueToDisplay.box).toEqual('inProgress');

      const workQueueFormatted = runCompute(formattedWorkQueue, {
        state: cerebralTest.getState(),
      });
      const inboxWorkItem = workQueueFormatted.find(
        workItem => workItem.docketNumber === cerebralTest.docketNumber,
      );

      expect(inboxWorkItem).toMatchObject({
        docketEntry: {
          documentTitle: 'Order to keep the free text',
        },
        editLink: `/case-detail/${cerebralTest.docketNumber}/document-view?docketEntryId=${inboxWorkItem.docketEntry.docketEntryId}`,
        inProgress: true,
      });
    });
  };
