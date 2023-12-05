import { applicationContext } from '../../src/applicationContext';

export const petitionsClerkAddsGenericOrderToCase = cerebralTest => {
  return it('Petitions clerk adds a generic Order (eventCode O) to case', async () => {
    await cerebralTest.runSequence('openCreateOrderChooseTypeModalSequence');

    await cerebralTest.runSequence('submitCreateOrderModalSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      documentTitle: 'Enter the title of this order',
      documentType: 'Select an order type',
      eventCode: 'Select an order type',
    });

    await cerebralTest.runSequence('updateCreateOrderModalFormValueSequence', {
      key: 'eventCode',
      value: 'O',
    });

    expect(cerebralTest.getState('modal.documentType')).toEqual('Order');

    cerebralTest.freeText = 'Order to keep the free text';

    await cerebralTest.runSequence('updateCreateOrderModalFormValueSequence', {
      key: 'documentTitle',
      value: cerebralTest.freeText,
    });

    await cerebralTest.runSequence('submitCreateOrderModalSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'richText',
      value: '<p>This is a test order.</p>',
    });

    await cerebralTest.runSequence('submitCourtIssuedOrderSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});
    expect(cerebralTest.getState('pdfPreviewUrl')).toBeDefined();

    const { draftDocuments } = applicationContext
      .getUtilities()
      .getFormattedCaseDetail({
        applicationContext,
        caseDetail: cerebralTest.getState('caseDetail'),
      });

    const createdOrder = draftDocuments[0];

    expect(createdOrder.documentTitle).toEqual(cerebralTest.freeText);
    expect(createdOrder.freeText).toEqual(cerebralTest.freeText);
    expect(createdOrder.draftOrderState.documentTitle).toEqual(
      cerebralTest.freeText,
    );
    expect(createdOrder.freeText).toEqual(cerebralTest.freeText);

    cerebralTest.docketEntryId = createdOrder.docketEntryId;
  });
};
