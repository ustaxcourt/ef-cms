import { OrderWithoutBody } from '../../../shared/src/business/entities/orders/OrderWithoutBody';
import { applicationContext } from '../../src/applicationContext';
import { first } from 'lodash';

const errorMessages = OrderWithoutBody.VALIDATION_ERROR_MESSAGES;

export const petitionsClerkAddsNoticeToCase = test => {
  return it('Petitions clerk adds Notice to case', async () => {
    await test.runSequence('openCreateOrderChooseTypeModalSequence');

    await test.runSequence('submitCreateOrderModalSequence');

    expect(test.getState('validationErrors')).toEqual({
      documentTitle: errorMessages.documentTitle[0].message,
      documentType: errorMessages.documentType,
      eventCode: errorMessages.eventCode,
    });

    await test.runSequence('updateCreateOrderModalFormValueSequence', {
      key: 'eventCode',
      value: 'NOT',
    });

    await test.runSequence('updateCreateOrderModalFormValueSequence', {
      key: 'documentTitle',
      value: 'Notice to Need a Nap',
    });

    expect(test.getState('modal.documentType')).toEqual('Notice');

    await test.runSequence('submitCreateOrderModalSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('updateFormValueSequence', {
      key: 'richText',
      value: '<p>This is a test notice.</p>',
    });

    await test.runSequence('submitCourtIssuedOrderSequence');

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(test.getState('validationErrors')).toEqual({});
    expect(test.getState('pdfPreviewUrl')).toBeDefined();

    // skip signing and go back to caseDetail
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const { draftDocuments } = applicationContext
      .getUtilities()
      .getFormattedCaseDetail({
        applicationContext,
        caseDetail: test.getState('caseDetail'),
      });

    const firstDraftDocument = first(draftDocuments);
    test.docketEntryId = firstDraftDocument
      ? firstDraftDocument.docketEntryId
      : undefined;

    if (firstDraftDocument) {
      expect(firstDraftDocument.signedAt).toBeTruthy(); // Notice should be implicitly signed.
    }

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
  });
};
