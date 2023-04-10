import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const petitionsClerkEditsDraftOrder = (
  cerebralTest,
  {
    currentRichText = '<p>This is a test order.</p>',
    setRichText = '<p>This is an edited test order.</p>',
  },
) => {
  return it('Petitions Clerk edits draft order', async () => {
    const formatted = runCompute(formattedCaseDetail, {
      state: cerebralTest.getState(),
    });

    const draftOrder = formatted.draftDocuments[0];

    await cerebralTest.runSequence('gotoEditOrderSequence', {
      docketEntryIdToEdit: draftOrder.docketEntryId,
      docketNumber: draftOrder.docketNumber,
    });

    expect(cerebralTest.getState('form.richText')).toEqual(currentRichText);

    cerebralTest.setState('form.richText', setRichText);
    await cerebralTest.runSequence('submitCourtIssuedOrderSequence');

    await cerebralTest.runSequence('gotoEditOrderSequence', {
      docketEntryIdToEdit: draftOrder.docketEntryId,
      docketNumber: draftOrder.docketNumber,
    });

    expect(cerebralTest.getState('form.richText')).toEqual(setRichText);

    await cerebralTest.runSequence('submitCourtIssuedOrderSequence');

    expect(cerebralTest.getState('currentPage')).toEqual('SignOrder');
  });
};
