import { getFormattedDocketEntriesForTest } from '../helpers';

export const docketClerkUnsealsDocketEntry = (
  cerebralTest,
  draftOrderIndex,
) => {
  return it('Docket clerk unseals a docket entry', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const { docketEntryId } = cerebralTest.draftOrders[draftOrderIndex];

    await cerebralTest.runSequence('openUnsealDocketEntryModalSequence', {
      docketEntryId,
    });

    await cerebralTest.runSequence('unsealDocketEntrySequence');

    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);

    const sealedDocketEntry = formattedDocketEntriesOnDocketRecord.find(
      docketEntry => docketEntry.docketEntryId === docketEntryId,
    );

    expect(sealedDocketEntry.isSealed).toBe(false);
    expect(sealedDocketEntry.sealedTo).toBeUndefined();
    expect(sealedDocketEntry.sealedToTooltip).not.toBe('Sealed to the public');
  });
};
