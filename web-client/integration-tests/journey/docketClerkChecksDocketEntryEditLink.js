import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkChecksDocketEntryEditLink = (test, data = {}) => {
  return it('Docket Clerk checks docket entry edit link', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    const lastIndex =
      caseDetailFormatted.formattedDocketEntriesOnDocketRecord.length - 1;
    data.index = data.index || lastIndex;
    data.value = !!data.value;

    expect(
      caseDetailFormatted.formattedDocketEntriesOnDocketRecord[data.index]
        .showEditDocketRecordEntry,
    ).toEqual(data.value);
  });
};
