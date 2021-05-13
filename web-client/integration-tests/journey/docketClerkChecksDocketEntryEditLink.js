import { formattedDocketEntries } from '../../src/presenter/computeds/formattedDocketEntries';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkChecksDocketEntryEditLink = (test, data = {}) => {
  return it('Docket Clerk checks docket entry edit link', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const helper = runCompute(withAppContextDecorator(formattedDocketEntries), {
      state: test.getState(),
    });

    const lastIndex = helper.formattedDocketEntriesOnDocketRecord.length - 1;
    data.index = data.index || lastIndex;
    data.value = !!data.value;

    expect(
      helper.formattedDocketEntriesOnDocketRecord[data.index]
        .showEditDocketRecordEntry,
    ).toEqual(data.value);
  });
};
