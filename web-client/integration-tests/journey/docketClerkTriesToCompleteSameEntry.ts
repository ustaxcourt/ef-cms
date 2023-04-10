import { waitForPage } from '../helpers';

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

    await waitForPage({
      cerebralTest,
      expectedPage: 'CaseDetailInternal',
    });
  });
};
