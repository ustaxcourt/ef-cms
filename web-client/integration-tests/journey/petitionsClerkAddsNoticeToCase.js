import { OrderWithoutBody } from '../../../shared/src/business/entities/orders/OrderWithoutBody';
import { applicationContext } from '../../src/applicationContext';
import { first } from 'lodash';

const errorMessages = OrderWithoutBody.VALIDATION_ERROR_MESSAGES;

export const petitionsClerkAddsNoticeToCase = test => {
  return it('Petitions clerk adds Notice to case', async () => {
    await test.runSequence('openCreateMessageModalSequence');

    await test.runSequence('submitCreateOrderModalSequence');

    expect(test.getState('validationErrors')).toEqual({
      documentTitle: errorMessages.documentTitle,
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

    expect(test.getState('currentPage')).toEqual('DocumentDetail');
    expect(test.getState('validationErrors')).toEqual({});
    expect(test.getState('pdfPreviewUrl')).toBeDefined();

    // TODO: this test will be re-enabled or removed during this story: https://app.zenhub.com/workspaces/flexionef-cms-5bbe4bed4b5806bc2bec65d3/issues/flexion/ef-cms/4613
    // await test.runSequence('setPDFSignatureDataSequence', {
    //   isPdfAlreadySigned: false,
    //   signatureApplied: false,
    //   signatureData: { scale: 1, x: 20, y: 20 },
    // });
    // await test.runSequence('saveDocumentSigningSequence');

    //skip signing and go back to caseDetail
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const {
      draftDocuments,
    } = applicationContext.getUtilities().getFormattedCaseDetail({
      applicationContext,
      caseDetail: test.getState('caseDetail'),
    });

    test.documentId = first(draftDocuments)
      ? first(draftDocuments).documentId
      : undefined;

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
  });
};
