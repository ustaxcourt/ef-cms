import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed);

export const petitionsClerkAddsDocketEntryForOrderAndSavesForLater = test => {
  return it('Petitions clerk adds docket entry for order and saves for later', async () => {
    await test.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
      docketEntryId: test.docketEntryId,
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CourtIssuedDocketEntry');
    expect(test.getState('form.freeText')).toEqual(test.freeText);

    await test.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    await test.runSequence('gotoWorkQueueSequence');
    expect(test.getState('currentPage')).toEqual('WorkQueue');
    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inProgress',
      queue: 'my',
    });

    const workQueueToDisplay = test.getState('workQueueToDisplay');

    expect(workQueueToDisplay.queue).toEqual('my');
    expect(workQueueToDisplay.box).toEqual('inProgress');

    const workQueueFormatted = runCompute(formattedWorkQueue, {
      state: test.getState(),
    });
    const inboxWorkItem = workQueueFormatted.find(
      workItem => workItem.docketNumber === test.docketNumber,
    );

    expect(inboxWorkItem).toMatchObject({
      docketEntry: {
        documentTitle: 'Order to keep the free text',
      },
      editLink: `/case-detail/${test.docketNumber}/document-view?docketEntryId=${inboxWorkItem.docketEntry.docketEntryId}`,
      inProgress: true,
    });
  });
};
