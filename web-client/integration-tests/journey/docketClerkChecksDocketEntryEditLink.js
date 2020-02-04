import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export default (test, data = {}) => {
  return it('Docket Clerk ', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    const lastIndex = caseDetailFormatted.formattedDocketEntries.length - 1;
    data.index = data.index || lastIndex;
    data.value = !!data.value;

    expect(
      caseDetailFormatted.formattedDocketEntries[data.index]
        .showEditDocketRecordEntry,
    ).toEqual(data.value);
  });
};
