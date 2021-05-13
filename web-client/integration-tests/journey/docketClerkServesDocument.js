import { formattedDocketEntries } from '../../src/presenter/computeds/formattedDocketEntries';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkServesDocument = (test, draftOrderIndex) => {
  return it(`Docket Clerk serves the order after the docket entry has been created ${draftOrderIndex}`, async () => {
    const helper = runCompute(withAppContextDecorator(formattedDocketEntries), {
      state: test.getState(),
    });

    const { docketEntryId } = test.draftOrders[draftOrderIndex];

    const orderDocument = helper.formattedDocketEntriesOnDocketRecord.find(
      doc => doc.docketEntryId === docketEntryId,
    );

    await test.runSequence('gotoEditCourtIssuedDocketEntrySequence', {
      docketEntryId: orderDocument.docketEntryId,
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CourtIssuedDocketEntry');

    await test.runSequence('openConfirmInitiateServiceModalSequence');

    await test.runSequence('serveCourtIssuedDocumentFromDocketEntrySequence');

    await refreshElasticsearchIndex();
  });
};
