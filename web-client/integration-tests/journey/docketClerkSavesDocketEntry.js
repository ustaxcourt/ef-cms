import { formattedDocketEntries } from '../../src/presenter/computeds/formattedDocketEntries';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkSavesDocketEntry = test => {
  return it('Docketclerk saves docket entry', async () => {
    await test.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    const helper = await runCompute(
      withAppContextDecorator(formattedDocketEntries),
      {
        state: test.getState(),
      },
    );

    test.docketRecordEntry = helper.formattedDocketEntriesOnDocketRecord.find(
      entry => entry.documentTitle === 'Administrative Record',
    );

    expect(test.docketRecordEntry.index).toBeFalsy();
  });
};
