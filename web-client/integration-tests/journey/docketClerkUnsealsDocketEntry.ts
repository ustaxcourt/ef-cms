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

    const unsealedDocketEntry = formattedDocketEntriesOnDocketRecord.find(
      docketEntry => docketEntry.docketEntryId === docketEntryId,
    );

    expect(unsealedDocketEntry.isSealed).toBe(false);
    expect(unsealedDocketEntry.sealedTo).toBeUndefined();
    expect(unsealedDocketEntry.iconsToDisplay).toEqual(
      expect.not.arrayContaining([
        expect.objectContaining({
          className: 'sealed-docket-entry',
          icon: 'lock',
        }),
      ]),
    );
  });
};
