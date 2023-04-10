import { OrderWithoutBody } from '../../../shared/src/business/entities/orders/OrderWithoutBody';
import { applicationContext } from '../../src/applicationContext';
import { first } from 'lodash';

const errorMessages = OrderWithoutBody.VALIDATION_ERROR_MESSAGES;

export const petitionsClerkAddsNoticeToCase = cerebralTest => {
  return it('Petitions clerk adds Notice to case', async () => {
    await cerebralTest.runSequence('openCreateOrderChooseTypeModalSequence');

    await cerebralTest.runSequence('submitCreateOrderModalSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      documentTitle: errorMessages.documentTitle[0].message,
      documentType: errorMessages.documentType,
      eventCode: errorMessages.eventCode,
    });

    await cerebralTest.runSequence('updateCreateOrderModalFormValueSequence', {
      key: 'eventCode',
      value: 'NOT',
    });

    await cerebralTest.runSequence('updateCreateOrderModalFormValueSequence', {
      key: 'documentTitle',
      value: 'Notice to Need a Nap',
    });

    expect(cerebralTest.getState('modal.documentType')).toEqual('Notice');

    await cerebralTest.runSequence('submitCreateOrderModalSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'richText',
      value: '<p>This is a test notice.</p>',
    });

    await cerebralTest.runSequence('submitCourtIssuedOrderSequence');

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(cerebralTest.getState('validationErrors')).toEqual({});
    expect(cerebralTest.getState('pdfPreviewUrl')).toBeDefined();

    // skip signing and go back to caseDetail
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const { draftDocuments } = applicationContext
      .getUtilities()
      .getFormattedCaseDetail({
        applicationContext,
        caseDetail: cerebralTest.getState('caseDetail'),
      });

    const firstDraftDocument = first(draftDocuments);
    cerebralTest.docketEntryId = firstDraftDocument
      ? firstDraftDocument.docketEntryId
      : undefined;

    if (firstDraftDocument) {
      expect(firstDraftDocument.signedAt).toBeTruthy(); // Notice should be implicitly signed.
    }

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');
  });
};
