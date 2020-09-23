import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionsClerkViewsDocketEntry = (test, draftOrderIndex) => {
  return it('Petitions Clerk views the docket entry for the given document', async () => {
    const caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    const { documentId } = test.draftOrders[draftOrderIndex];

    const docketRecordEntry = caseDetailFormatted.formattedDocketEntries.find(
      entry => entry.documentId === documentId,
    );

    expect(docketRecordEntry).toBeTruthy();
  });
};
