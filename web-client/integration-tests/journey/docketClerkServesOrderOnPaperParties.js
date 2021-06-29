import { confirmInitiateServiceModalHelper } from '../../src/presenter/computeds/confirmInitiateServiceModalHelper';
import { getFormattedDocketEntriesForTest } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkServesOrderOnPaperParties = (test, draftOrderIndex) => {
  return it('Docket Clerk serves the order on 3 parties with paper service', async () => {
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(test);

    const { docketEntryId } = test.draftOrders[draftOrderIndex];

    const orderDocument = formattedDocketEntriesOnDocketRecord.find(
      doc => doc.docketEntryId === docketEntryId,
    );

    expect(orderDocument).toBeTruthy();

    await test.runSequence('gotoEditCourtIssuedDocketEntrySequence', {
      docketEntryId: orderDocument.docketEntryId,
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CourtIssuedDocketEntry');

    await test.runSequence('openConfirmInitiateServiceModalSequence');

    const modalHelper = runCompute(
      withAppContextDecorator(confirmInitiateServiceModalHelper),
      {
        state: test.getState(),
      },
    );

    expect(modalHelper.showPaperAlert).toEqual(true);

    expect(modalHelper.contactsNeedingPaperService.length).toEqual(2);

    await test.runSequence('serveCourtIssuedDocumentFromDocketEntrySequence');
  });
};
