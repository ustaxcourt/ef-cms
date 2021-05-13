import { formattedDocketEntries } from '../../src/presenter/computeds/formattedDocketEntries';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionsClerkViewsDocketEntry = (test, draftOrderIndex) => {
  return it('Petitions Clerk views the docket entry for the given document', async () => {
    const helper = runCompute(withAppContextDecorator(formattedDocketEntries), {
      state: test.getState(),
    });

    const { docketEntryId } = test.draftOrders[draftOrderIndex];

    const docketRecordEntry = helper.formattedDocketEntriesOnDocketRecord.find(
      entry => entry.docketEntryId === docketEntryId,
    );

    expect(docketRecordEntry).toBeTruthy();
  });
};
