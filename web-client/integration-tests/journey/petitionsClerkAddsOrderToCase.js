import { OrderWithoutBody } from '../../../shared/src/business/entities/orders/OrderWithoutBody';
import { applicationContext } from '../../src/applicationContext';
import { first } from 'lodash';

const errorMessages = OrderWithoutBody.VALIDATION_ERROR_MESSAGES;

export const petitionsClerkAddsOrderToCase = test => {
  return it('Petitions clerk adds Order to case', async () => {
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

    const {
      draftDocuments,
    } = applicationContext.getUtilities().getFormattedCaseDetail({
      applicationContext,
      caseDetail: test.getState('caseDetail'),
    });

    test.documentId = first(draftDocuments)
      ? first(draftDocuments).documentId
      : undefined;
  });
};
