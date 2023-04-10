import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const petitionsClerkEditsGenericOrder = cerebralTest => {
  return it('Petitions Clerk edits generic order', async () => {
    const formatted = runCompute(formattedCaseDetail, {
      state: cerebralTest.getState(),
    });

    const draftOrder = formatted.draftDocuments[0];

    await cerebralTest.runSequence('gotoEditOrderSequence', {
      docketEntryIdToEdit: draftOrder.docketEntryId,
      docketNumber: draftOrder.docketNumber,
    });

    await cerebralTest.runSequence('submitCourtIssuedOrderSequence');

    expect(cerebralTest.getState('currentPage')).toEqual('SignOrder');
  });
};
