import { OrderWithoutBody } from '../../../shared/src/business/entities/orders/OrderWithoutBody';
import { applicationContext } from '../../src/applicationContext';
import { first } from 'lodash';

const errorMessages = OrderWithoutBody.VALIDATION_ERROR_MESSAGES;

export const petitionsClerkAddsGenericOrderToCase = test => {
  return it('Petitions clerk adds a generic Order (eventCode O) to case', async () => {
    await test.runSequence('openCreateOrderChooseTypeModalSequence');

    await test.runSequence('submitCreateOrderModalSequence');

    expect(test.getState('validationErrors')).toEqual({
      documentTitle: errorMessages.documentTitle[0].message,
      documentType: errorMessages.documentType,
      eventCode: errorMessages.eventCode,
    });

    await test.runSequence('updateCreateOrderModalFormValueSequence', {
      key: 'eventCode',
      value: 'O',
    });

    expect(test.getState('modal.documentType')).toEqual('Order');

    test.freeText = 'Order to keep the free text';

    await test.runSequence('updateCreateOrderModalFormValueSequence', {
      key: 'documentTitle',
      value: test.freeText,
    });

    await test.runSequence('submitCreateOrderModalSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('updateFormValueSequence', {
      key: 'richText',
      value: '<p>This is a test order.</p>',
    });

    await test.runSequence('submitCourtIssuedOrderSequence');

    expect(test.getState('validationErrors')).toEqual({});
    expect(test.getState('pdfPreviewUrl')).toBeDefined();

    const { draftDocuments } = applicationContext
      .getUtilities()
      .getFormattedCaseDetail({
        applicationContext,
        caseDetail: test.getState('caseDetail'),
      });

    const createdOrder = first(draftDocuments);

    expect(createdOrder.documentTitle).toEqual(test.freeText);
    expect(createdOrder.freeText).toEqual(test.freeText);
    expect(createdOrder.draftOrderState.documentTitle).toEqual(test.freeText);
    expect(createdOrder.freeText).toEqual(test.freeText);

    test.docketEntryId = createdOrder.docketEntryId;
  });
};
