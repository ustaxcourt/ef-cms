import { docketClerkQCsDocketEntry } from './docketClerkQCsDocketEntry';
import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { refreshElasticsearchIndex } from '../helpers';
import { runSequence } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed);

export const docketClerkTriesToCompleteSameEntry = cerebralTest => {
  return it('docketclerk tries to complete same docket entry QC for the proposed stipulated decision', async () => {
    await cerebralTest.runSequence('gotoDocketEntryQcSequence', {
      docketEntryId: cerebralTest.proposedStipDecisionDocketEntryId,
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('modal.showModal')).toEqual(
      'WorkItemAlreadyCompletedModal',
    );

    await cerebralTest.runSequence('confirmWorkItemAlreadyCompleteSequence');

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');
  });
};
