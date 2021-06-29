import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const petitionsClerkEditsDraftOrder = (
  test,
  {
    currentRichText = '<p>This is a test order.</p>',
    setRichText = '<p>This is an edited test order.</p>',
  },
) => {
  return it('Petitions Clerk edits draft order', async () => {
    const formatted = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });

    const draftOrder = formatted.draftDocuments[0];

    await test.runSequence('gotoEditOrderSequence', {
      docketEntryIdToEdit: draftOrder.docketEntryId,
      docketNumber: draftOrder.docketNumber,
    });

    expect(test.getState('form.richText')).toEqual(currentRichText);

    test.setState('form.richText', setRichText);
    await test.runSequence('submitCourtIssuedOrderSequence');

    await test.runSequence('gotoEditOrderSequence', {
      docketEntryIdToEdit: draftOrder.docketEntryId,
      docketNumber: draftOrder.docketNumber,
    });

    expect(test.getState('form.richText')).toEqual(setRichText);

    await test.runSequence('submitCourtIssuedOrderSequence');

    expect(test.getState('currentPage')).toEqual('SignOrder');
  });
};
