import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkSavesDocketEntry = test => {
  return it('Docketclerk saves docket entry', async () => {
    await test.runSequence('saveForLaterDocketEntrySequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    const caseDetailFormatted = await runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    test.docketRecordEntry = caseDetailFormatted.docketRecord.find(
      entry => entry.description === 'Administrative Record',
    );
  });
};
