import { applicationContext } from '../../src/applicationContext';
import { contactPrimaryFromState } from '../helpers';
import { formattedDocketEntries as formattedDocketEntriesComputed } from '../../src/presenter/computeds/formattedDocketEntries';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedDocketEntries = withAppContextDecorator(
  formattedDocketEntriesComputed,
  applicationContext,
);

export const privatePractitionerSeesStrickenDocketEntry = (
  test,
  docketRecordIndex,
) => {
  return it('private practitioner sees stricken docket entry on case detail', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const contactPrimary = contactPrimaryFromState(test);
    expect(contactPrimary.name).toBeDefined();

    const { formattedDocketEntriesOnDocketRecord } = runCompute(
      formattedDocketEntries,
      {
        state: test.getState(),
      },
    );

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
