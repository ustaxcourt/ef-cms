import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkSavesAndServesDocketEntry = test => {
  return it('Docketclerk saves and serves a docket entry', async () => {
    await test.runSequence('fileDocketEntrySequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    const caseDetailFormatted = await runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    test.docketRecordEntry = caseDetailFormatted.formattedDocketEntries.find(
      entry => entry.eventCode === 'ADMR',
    );

    expect(test.docketRecordEntry.index).toBeTruthy();
  });
};
