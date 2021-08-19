import { getFormattedDocketEntriesForTest } from '../helpers';

export const docketClerkChecksDocketEntryEditLink = (
  cerebralTest,
  data = {},
) => {
  return it('Docket Clerk checks docket entry edit link', async () => {
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);

    const lastIndex = formattedDocketEntriesOnDocketRecord.length - 1;
    data.index = data.index || lastIndex;
    data.value = !!data.value;

    expect(
      formattedDocketEntriesOnDocketRecord[data.index]
        .showEditDocketRecordEntry,
    ).toEqual(data.value);
  });
};
