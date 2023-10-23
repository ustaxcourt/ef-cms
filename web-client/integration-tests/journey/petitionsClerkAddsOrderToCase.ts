import { OrderWithoutBody } from '../../../shared/src/business/entities/orders/OrderWithoutBody';
import { applicationContext } from '../../src/applicationContext';
import { extractCustomMessages } from '@shared/business/entities/utilities/extractCustomMessages';
import { first } from 'lodash';
const customMessages = extractCustomMessages(OrderWithoutBody);

export const petitionsClerkAddsOrderToCase = cerebralTest => {
  return it('Petitions clerk adds Order to case', async () => {
    await cerebralTest.runSequence('openCreateOrderChooseTypeModalSequence');

    await cerebralTest.runSequence('submitCreateOrderModalSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      documentTitle: customMessages.documentTitle[1],
      documentType: customMessages.documentType[0],
      eventCode: customMessages.eventCode[0],
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

    const { draftDocuments } = applicationContext
      .getUtilities()
      .getFormattedCaseDetail({
        applicationContext,
        caseDetail: cerebralTest.getState('caseDetail'),
      });

    cerebralTest.docketEntryId = first(draftDocuments)
      ? first(draftDocuments).docketEntryId
      : undefined;
  });
};
