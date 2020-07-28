import { OrderWithoutBody } from '../../../shared/src/business/entities/orders/OrderWithoutBody';

const errorMessages = OrderWithoutBody.VALIDATION_ERROR_MESSAGES;

export const chambersUserSkipSigningOrder = test => {
  return it('Chambers user adds order and skips signing', async () => {
    await test.runSequence('openCreateMessageModalSequence');

    await test.runSequence('submitCreateOrderModalSequence');

    expect(test.getState('validationErrors')).toEqual({
      documentTitle: errorMessages.documentTitle,
      documentType: errorMessages.documentType,
      eventCode: errorMessages.eventCode,
    });

    await test.runSequence('updateCreateOrderModalFormValueSequence', {
      key: 'eventCode',
      value: 'ODD',
    });

    expect(test.getState('modal.documentType')).toEqual(
      'Order of Dismissal and Decision',
    );

    await test.runSequence('submitCreateOrderModalSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('updateFormValueSequence', {
      key: 'richText',
      value: '<p>This is a test order.</p>',
    });

    await test.runSequence('submitCourtIssuedOrderSequence');

    expect(test.getState('validationErrors')).toEqual({});
    expect(test.getState('pdfPreviewUrl')).toBeDefined();

    //skip signing and go back to caseDetail
    await test.runSequence('skipSigningOrderSequence');

    // should navigate to the case detail internal page with the draft documents tab showing
    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    expect(
      test.getState(
        'currentViewMetadata.caseDetail.caseDetailInternalTabs.drafts',
      ),
    ).toBeTruthy();

    expect(test.getState('alertSuccess')).toBeDefined();
  });
};
