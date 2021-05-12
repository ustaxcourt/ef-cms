import { formattedDocketEntries } from '../../src/presenter/computeds/formattedDocketEntries';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkSavesAndServesDocketEntry = test => {
  return it('Docketclerk saves and serves a docket entry', async () => {
    await test.runSequence('submitPaperFilingSequence');

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    const helper = await runCompute(
      withAppContextDecorator(formattedDocketEntries),
      {
        state: test.getState(),
      },
    );

    test.docketRecordEntry = helper.formattedDocketEntriesOnDocketRecord.find(
      entry => entry.eventCode === 'ADMR',
    );

    expect(test.docketRecordEntry.index).toBeTruthy();
  });
};
