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

    const lastIndex = caseDetailFormatted.formattedDocketEntries.length - 1;
    data.index = data.index || lastIndex;

    const { documentId } = caseDetailFormatted.formattedDocketEntries[
      data.index
    ];

    await test.runSequence('gotoEditDocketEntrySequence', {
      docketNumber: caseDetailFormatted.docketNumber,
      documentId,
    });

    await test.runSequence('completeDocketEntryQCSequence');

    expect(test.getState('validationErrors')).toEqual({});

    caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    const selectedDocument = caseDetailFormatted.documents.find(
      document => document.documentId === documentId,
    );

    expect(selectedDocument.qcWorkItemsCompleted).toEqual(true);
  });
};
