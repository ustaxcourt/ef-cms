import { confirmInitiateServiceModalHelper } from '../../src/presenter/computeds/confirmInitiateServiceModalHelper';
import { getFormattedDocketEntriesForTest, waitForCondition } from '../helpers';
import { runCompute } from '@web-client/presenter/test.cerebral';
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

    await cerebralTest.runSequence(
      'openConfirmInitiateCourtIssuedFilingServiceModalSequence',
    );

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
      'fileAndServeCourtIssuedDocumentFromDocketEntrySequence',
    );

    await waitForCondition({
      booleanExpressionCondition: () =>
        cerebralTest.getState('currentPage') === 'PrintPaperService',
    });

    expect(cerebralTest.getState('currentPage')).toEqual('PrintPaperService');
    expect(cerebralTest.getState('pdfPreviewUrl')).toBeDefined();
  });
};
