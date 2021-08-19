import { DocketEntryFactory } from '../../../shared/src/business/entities/docketEntry/DocketEntryFactory';
import { contactPrimaryFromState } from '../helpers';

export const docketClerkAddsTrackedDocketEntry = (
  cerebralTest,
  fakeFile,
  paperServiceRequested = false,
) => {
  const { VALIDATION_ERROR_MESSAGES } = DocketEntryFactory;

  return it('Docketclerk adds tracked paper filing', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('gotoAddPaperFilingSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('submitPaperFilingSequence');

    expect(cerebralTest.getState('validationErrors')).toMatchObject({
      dateReceived: VALIDATION_ERROR_MESSAGES.dateReceived[1],
      documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
      eventCode: VALIDATION_ERROR_MESSAGES.eventCode,
      filers: VALIDATION_ERROR_MESSAGES.filers,
      primaryDocumentFile:
        'Scan or upload a document to serve, or click Save for Later to serve at a later time',
    });

    // primary document
    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedMonth',
      value: 1,
    });
    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedDay',
      value: 1,
    });
    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedYear',
      value: 2018,
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'primaryDocumentFileSize',
      value: 100,
    });

    const contactPrimary = contactPrimaryFromState(cerebralTest);

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: `filersMap.${contactPrimary.contactId}`,
        value: true,
      },
    );

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'APPL',
    });

    expect(cerebralTest.getState('form.documentType')).toEqual('Application');

    await cerebralTest.runSequence('submitPaperFilingSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      freeText: VALIDATION_ERROR_MESSAGES.freeText[0].message,
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'freeText',
      value: 'Application for Flavortown',
    });

    await cerebralTest.runSequence('submitPaperFilingSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    if (!paperServiceRequested) {
      expect(cerebralTest.getState('alertSuccess').message).toEqual(
        'Your entry has been added to docket record.',
      );

      expect(cerebralTest.getState('currentPage')).toEqual(
        'CaseDetailInternal',
      );
    } else {
      expect(cerebralTest.getState('pdfPreviewUrl')).toBeDefined();
      expect(cerebralTest.getState('currentPage')).toEqual('PrintPaperService');
    }
    expect(cerebralTest.getState('form')).toEqual({});

    expect(cerebralTest.getState('caseDetail.hasPendingItems')).toEqual(true);
    expect(cerebralTest.getState('caseDetail.automaticBlocked')).toEqual(true);
  });
};
