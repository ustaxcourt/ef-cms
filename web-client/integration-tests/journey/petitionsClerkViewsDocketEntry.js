import { getFormattedDocketEntriesForTest } from '../helpers';

export const petitionsClerkViewsDocketEntry = (
  cerebralTest,
  draftOrderIndex,
) => {
  return it('Petitions Clerk views the docket entry for the given document', async () => {
    const { docketEntryId } = cerebralTest.draftOrders[draftOrderIndex];
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);

    const docketRecordEntry = formattedDocketEntriesOnDocketRecord.find(
      entry => entry.docketEntryId === docketEntryId,
    );

    expect(docketRecordEntry).toBeTruthy();
  });
};
