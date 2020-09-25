import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkQCsDocketEntry = (test, data = {}) => {
  return it('Docket Clerk QCs docket entry', async () => {
    let caseDetailFormatted;
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    const lastIndex =
      caseDetailFormatted.formattedDocketEntriesOnDocketRecord.length - 1;
    data.index = data.index || lastIndex;

    const {
      docketEntryId,
    } = caseDetailFormatted.formattedDocketEntriesOnDocketRecord[data.index];

    await test.runSequence('gotoEditDocketEntrySequence', {
      docketEntryId,
      docketNumber: caseDetailFormatted.docketNumber,
    });

    await test.runSequence('completeDocketEntryQCSequence');

    expect(test.getState('validationErrors')).toEqual({});

    caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    const selectedDocument = caseDetailFormatted.formattedDocketEntriesOnDocketRecord.find(
      document => document.docketEntryId === docketEntryId,
    );

    expect(selectedDocument.qcWorkItemsCompleted).toEqual(true);
  });
};
