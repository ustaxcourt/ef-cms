import { OrderWithoutBody } from '../../../shared/src/business/entities/orders/OrderWithoutBody';

const errorMessages = OrderWithoutBody.VALIDATION_ERROR_MESSAGES;

export const chambersUserSkipSigningOrder = cerebralTest => {
  return it('Chambers user adds order and skips signing', async () => {
    await cerebralTest.runSequence('openCreateOrderChooseTypeModalSequence');

    await cerebralTest.runSequence('submitCreateOrderModalSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      documentTitle: errorMessages.documentTitle[0].message,
      documentType: errorMessages.documentType,
      eventCode: errorMessages.eventCode,
    });

    await cerebralTest.runSequence('updateCreateOrderModalFormValueSequence', {
      key: 'eventCode',
      value: 'ODD',
    });

    expect(cerebralTest.getState('modal.documentType')).toEqual(
      'Order of Dismissal and Decision',
    );

    await cerebralTest.runSequence('submitCreateOrderModalSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'richText',
      value: '<p>This is a test order.</p>',
    });

    await cerebralTest.runSequence('submitCourtIssuedOrderSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});
    expect(cerebralTest.getState('pdfPreviewUrl')).toBeDefined();

    //skip signing and go back to caseDetail
    await cerebralTest.runSequence('skipSigningOrderSequence');

    // should navigate to the case detail internal page with the draft documents tab showing
    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');

    expect(
      cerebralTest.getState(
        'currentViewMetadata.caseDetail.caseDetailInternalTabs.drafts',
      ),
    ).toBeTruthy();

    expect(cerebralTest.getState('alertSuccess')).toBeDefined();
  });
};
