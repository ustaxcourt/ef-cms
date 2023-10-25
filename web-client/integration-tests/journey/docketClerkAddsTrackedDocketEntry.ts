import { DocketEntryFactory } from '../../../shared/src/business/entities/docketEntry/DocketEntryFactory';
import { FORMATS } from '@shared/business/utilities/DateHandler';
import { contactPrimaryFromState, waitForCondition } from '../helpers';
import { extractCustomMessages } from '@shared/business/entities/utilities/extractCustomMessages';
const customMessages = extractCustomMessages(DocketEntryFactory);

export const docketClerkAddsTrackedDocketEntry = (
  cerebralTest,
  fakeFile,
  paperServiceRequested = false,
) => {
  return it('Docketclerk adds tracked paper filing', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('gotoAddPaperFilingSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('submitPaperFilingSequence');

    expect(cerebralTest.getState('validationErrors')).toMatchObject({
      documentType: customMessages.documentType[0],
      eventCode: customMessages.eventCode[0],
      filers: customMessages.filers[0],
      primaryDocumentFile:
        'Scan or upload a document to serve, or click Save for Later to serve at a later time',
      receivedAt: customMessages.dateReceived[1],
    });

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'receivedAt',
        toFormat: FORMATS.ISO,
        value: '1/1/2018',
      },
    );

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
      freeText: customMessages.freeText[1],
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'freeText',
      value: 'Application for Flavortown',
    });

    await cerebralTest.runSequence('submitPaperFilingSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await waitForCondition({
      booleanExpressionCondition: () =>
        cerebralTest.getState('currentPage') === 'CaseDetailInternal',
    });

    if (!paperServiceRequested) {
      expect(cerebralTest.getState('alertSuccess').message).toEqual(
        'Your entry has been added to the docket record.',
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
