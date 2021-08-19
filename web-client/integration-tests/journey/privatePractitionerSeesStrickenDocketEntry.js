import {
  contactPrimaryFromState,
  getFormattedDocketEntriesForTest,
} from '../helpers';

export const privatePractitionerSeesStrickenDocketEntry = (
  cerebralTest,
  docketRecordIndex,
) => {
  return it('private practitioner sees stricken docket entry on case detail', async () => {
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);

    const contactPrimary = contactPrimaryFromState(cerebralTest);
    expect(contactPrimary.name).toBeDefined();

    const formattedDocketEntry = formattedDocketEntriesOnDocketRecord.find(
      docketEntry => docketEntry.index === docketRecordIndex,
    );
    cerebralTest.docketEntryId = formattedDocketEntry.docketEntryId;

    expect(formattedDocketEntry.isStricken).toEqual(true);
    expect(formattedDocketEntry.showDocumentDescriptionWithoutLink).toEqual(
      true,
    );
  });
};
