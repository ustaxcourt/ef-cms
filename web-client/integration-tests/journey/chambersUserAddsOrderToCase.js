import { OrderWithoutBody } from '../../../shared/src/business/entities/orders/OrderWithoutBody';
import { applicationContext } from '../../src/applicationContext';
import { first } from 'lodash';

const errorMessages = OrderWithoutBody.VALIDATION_ERROR_MESSAGES;

export const chambersUserAddsOrderToCase = test => {
  return it('Chambers user adds order to case', async () => {
    await test.runSequence('openCreateOrderChooseTypeModalSequence');

    await test.runSequence('submitCreateOrderModalSequence');

    expect(test.getState('validationErrors')).toEqual({
      documentTitle: errorMessages.documentTitle[0].message,
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
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const { draftDocuments } = applicationContext
      .getUtilities()
      .getFormattedCaseDetail({
        applicationContext,
        caseDetail: test.getState('caseDetail'),
      });

    test.docketEntryId = first(draftDocuments)
      ? first(draftDocuments).docketEntryId
      : undefined;
  });
};
