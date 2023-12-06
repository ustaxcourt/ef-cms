import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkCreatesAnOrderWithAddedDocketNumbers = cerebralTest => {
  return it('Docket Clerk creates an order with added docket numbers', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence(
      'openCreateOrderChooseTypeModalSequence',
      {},
    );

    await cerebralTest.runSequence('updateCreateOrderModalFormValueSequence', {
      key: 'eventCode',
      value: 'O',
    });

    await cerebralTest.runSequence('updateCreateOrderModalFormValueSequence', {
      key: 'documentTitle',
      value: 'Order',
    });

    await cerebralTest.runSequence('submitCreateOrderModalSequence');

    await cerebralTest.runSequence('gotoCreateOrderSequence', {
      docketNumber: cerebralTest.docketNumber,
      documentTitle: decodeURIComponent('Order'),
      documentType: decodeURIComponent('Order'),
      eventCode: 'O',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'richText',
      value: 'Some order content',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'documentContents',
      value: 'Some order content',
    });

    await cerebralTest.runSequence('openAddDocketNumbersModalSequence');

    await cerebralTest.runSequence(
      'submitUpdateAddDocketNumbersToOrderSequence',
    );

    await cerebralTest.runSequence('submitCourtIssuedOrderSequence');

    //skip signing and go back to caseDetail
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: cerebralTest.getState(),
      },
    );

    const caseDraftDocuments = caseDetailFormatted.draftDocuments;
    const newDraftOrder = caseDraftDocuments.reduce((prev, current) =>
      prev.createdAt > current.createdAt ? prev : current,
    );

    expect(cerebralTest.getState('draftDocumentViewerDocketEntryId')).toBe(
      newDraftOrder.docketEntryId,
    );

    expect(newDraftOrder).toBeTruthy();
    if (!cerebralTest.draftOrders) {
      cerebralTest.draftOrders = [];
    }
    cerebralTest.draftOrders.push(newDraftOrder);
    cerebralTest.docketEntryId = newDraftOrder.docketEntryId;
  });
};
