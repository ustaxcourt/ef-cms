import { DOCKET_ENTRY_SEALED_TO_TYPES } from '../../../shared/src/business/entities/EntityConstants';
import { getFormattedDocketEntriesForTest } from '../helpers';

export const docketClerkSealsDocketEntry = (cerebralTest, draftOrderIndex) => {
  return it('Docket clerk seals a docket entry', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const { docketEntryId } = cerebralTest.draftOrders[draftOrderIndex];

    await cerebralTest.runSequence('openSealDocketEntryModalSequence', {
      docketEntryId,
    });

    await cerebralTest.runSequence('sealDocketEntrySequence');

    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);

    const sealedDocketEntry = formattedDocketEntriesOnDocketRecord.find(
      docketEntry => docketEntry.docketEntryId === docketEntryId,
    );

    expect(sealedDocketEntry.isSealed).toBe(true);
    expect(sealedDocketEntry.sealedTo).toBe(
      DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
    );
    expect(sealedDocketEntry.sealedToTooltip).toBe('Sealed to the public');
  });
};
