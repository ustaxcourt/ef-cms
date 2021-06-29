import {
  contactPrimaryFromState,
  getFormattedDocketEntriesForTest,
} from '../helpers';

export const privatePractitionerSeesStrickenDocketEntry = (
  test,
  docketRecordIndex,
) => {
  return it('private practitioner sees stricken docket entry on case detail', async () => {
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(test);

    const contactPrimary = contactPrimaryFromState(test);
    expect(contactPrimary.name).toBeDefined();

    const formattedDocketEntry = formattedDocketEntriesOnDocketRecord.find(
      docketEntry => docketEntry.index === docketRecordIndex,
    );
    test.docketEntryId = formattedDocketEntry.docketEntryId;

    expect(formattedDocketEntry.isStricken).toEqual(true);
    expect(formattedDocketEntry.showDocumentDescriptionWithoutLink).toEqual(
      true,
    );
  });
};
