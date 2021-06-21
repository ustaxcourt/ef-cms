import { getFormattedDocketEntriesForTest } from '../helpers';

export const petitionsClerkViewsDocketEntry = (test, draftOrderIndex) => {
  return it('Petitions Clerk views the docket entry for the given document', async () => {
    const { docketEntryId } = test.draftOrders[draftOrderIndex];
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(test);

    const docketRecordEntry = formattedDocketEntriesOnDocketRecord.find(
      entry => entry.docketEntryId === docketEntryId,
    );

    expect(docketRecordEntry).toBeTruthy();
  });
};
