import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkSavesDocketEntry = test => {
  return it('Docketclerk saves docket entry', async () => {
    await test.runSequence('fileDocketEntrySequence', {
      docketNumber: test.docketNumber,
      isSavingForLater: true,
    });

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    const caseDetailFormatted = await runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    test.docketRecordEntry = caseDetailFormatted.formattedDocketEntries.find(
      entry => entry.description === 'Administrative Record',
    );

    expect(test.docketRecordEntry.index).toBeFalsy();
  });
};
