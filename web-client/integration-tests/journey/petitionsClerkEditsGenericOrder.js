import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const petitionsClerkEditsGenericOrder = test => {
  return it('Petitions Clerk edits generic order', async () => {
    const formatted = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });

    const draftOrder = formatted.draftDocuments[0];

    await test.runSequence('gotoEditOrderSequence', {
      docketEntryIdToEdit: draftOrder.docketEntryId,
      docketNumber: draftOrder.docketNumber,
    });

    await test.runSequence('submitCourtIssuedOrderSequence');

    expect(test.getState('currentPage')).toEqual('SignOrder');
  });
};
