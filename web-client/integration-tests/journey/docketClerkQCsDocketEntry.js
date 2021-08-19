import { getFormattedDocketEntriesForTest } from '../helpers';

export const docketClerkQCsDocketEntry = (cerebralTest, data = {}) => {
  return it('Docket Clerk QCs docket entry', async () => {
    let { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);

    const lastIndex = formattedDocketEntriesOnDocketRecord.length - 1;
    data.index = data.index || lastIndex;

    const { docketEntryId } = formattedDocketEntriesOnDocketRecord[data.index];

    await cerebralTest.runSequence('gotoDocketEntryQcSequence', {
      docketEntryId,
      docketNumber: formattedDocketEntriesOnDocketRecord.docketNumber,
    });

    await cerebralTest.runSequence('completeDocketEntryQCSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    ({ formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest));

    const selectedDocument = formattedDocketEntriesOnDocketRecord.find(
      document => document.docketEntryId === docketEntryId,
    );

    expect(selectedDocument.qcWorkItemsCompleted).toEqual(true);
  });
};
