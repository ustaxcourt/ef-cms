import { confirmInitiateServiceModalHelper } from '../../src/presenter/computeds/confirmInitiateServiceModalHelper';
import { getFormattedDocketEntriesForTest } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkServesOrderWithPaperService = (
  cerebralTest,
  draftOrderIndex,
) => {
  return it('Docket Clerk serves the order after the docket entry has been created (with parties with paper service)', async () => {
    const { docketEntryId } = cerebralTest.draftOrders[draftOrderIndex];
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);

    const orderDocument = formattedDocketEntriesOnDocketRecord.find(
      doc => doc.docketEntryId === docketEntryId,
    );

    expect(orderDocument).toBeTruthy();

    await cerebralTest.runSequence('gotoEditCourtIssuedDocketEntrySequence', {
      docketEntryId: orderDocument.docketEntryId,
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual(
      'CourtIssuedDocketEntry',
    );

    await cerebralTest.runSequence('openConfirmInitiateServiceModalSequence');

    const modalHelper = runCompute(
      withAppContextDecorator(confirmInitiateServiceModalHelper),
      {
        state: cerebralTest.getState(),
      },
    );

    expect(modalHelper.showPaperAlert).toEqual(true);
    expect(modalHelper.contactsNeedingPaperService).toEqual([
      {
        name: 'Daenerys Stormborn, Petitioner',
      },
    ]);
    await cerebralTest.runSequence(
      'serveCourtIssuedDocumentFromDocketEntrySequence',
    );

    expect(cerebralTest.getState('currentPage')).toEqual('PrintPaperService');
    expect(cerebralTest.getState('pdfPreviewUrl')).toBeDefined();
  });
};
