import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkSavesAndServesDocketEntry = test => {
  return it('Docketclerk saves and serves a docket entry', async () => {
    await test.runSequence('saveAndServeDocketEntrySequence', {
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
