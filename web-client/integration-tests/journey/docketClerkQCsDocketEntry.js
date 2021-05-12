import { formattedDocketEntries } from '../../src/presenter/computeds/formattedDocketEntries';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkQCsDocketEntry = (test, data = {}) => {
  return it('Docket Clerk QCs docket entry', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    let helper = runCompute(withAppContextDecorator(formattedDocketEntries), {
      state: test.getState(),
    });

    const lastIndex = helper.formattedDocketEntriesOnDocketRecord.length - 1;
    data.index = data.index || lastIndex;

    const { docketEntryId } =
      helper.formattedDocketEntriesOnDocketRecord[data.index];

    await test.runSequence('gotoDocketEntryQcSequence', {
      docketEntryId,
      docketNumber: helper.docketNumber,
    });

    await test.runSequence('completeDocketEntryQCSequence');

    expect(test.getState('validationErrors')).toEqual({});

    helper = runCompute(withAppContextDecorator(formattedDocketEntries), {
      state: test.getState(),
    });

    const selectedDocument = helper.formattedDocketEntriesOnDocketRecord.find(
      document => document.docketEntryId === docketEntryId,
    );

    expect(selectedDocument.qcWorkItemsCompleted).toEqual(true);
  });
};
