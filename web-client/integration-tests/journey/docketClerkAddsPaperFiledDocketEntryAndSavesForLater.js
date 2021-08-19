import { DocketEntryFactory } from '../../../shared/src/business/entities/docketEntry/DocketEntryFactory';
import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { contactPrimaryFromState } from '../helpers';

export const docketClerkAddsPaperFiledDocketEntryAndSavesForLater = (
  cerebralTest,
  fakeFile,
) => {
  const { VALIDATION_ERROR_MESSAGES } = DocketEntryFactory;
  const { DOCUMENT_RELATIONSHIPS, OBJECTIONS_OPTIONS_MAP } =
    applicationContext.getConstants();

  return it('Docketclerk adds paper filed docket entry and saves for later', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('gotoAddPaperFilingSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('updateScreenMetadataSequence', {
      key: DOCUMENT_RELATIONSHIPS.SUPPORTING,
      value: false,
    });

    await cerebralTest.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    expect(cerebralTest.getState('validationErrors')).toMatchObject({
      dateReceived: VALIDATION_ERROR_MESSAGES.dateReceived[1],
      documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
      eventCode: VALIDATION_ERROR_MESSAGES.eventCode,
      filers: VALIDATION_ERROR_MESSAGES.filers,
    });

    //primary document
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

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: `filersMap.${contactPrimary.contactId}`,
      value: true,
    });

    const docketEntryEventCode = 'M115';
    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: docketEntryEventCode,
    });

    expect(cerebralTest.getState('form.documentType')).toEqual(
      'Motion for Leave to File',
    );

    await cerebralTest.runSequence('updateScreenMetadataSequence', {
      key: DOCUMENT_RELATIONSHIPS.SUPPORTING,
      value: false,
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'objections',
      value: OBJECTIONS_OPTIONS_MAP.NO,
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'secondaryDocument.eventCode',
      value: 'APPW',
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'secondaryDocumentFile',
      value: fakeFile,
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'secondaryDocumentFileSize',
      value: 100,
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'secondaryDocument.additionalInfo',
      value: 'Test Secondary Additional Info',
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'secondaryDocument.addToCoversheet',
      value: true,
    });

    await cerebralTest.runSequence('updateScreenMetadataSequence', {
      key: DOCUMENT_RELATIONSHIPS.SUPPORTING,
      value: true,
    });

    await cerebralTest.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    cerebralTest.docketEntryId = cerebralTest
      .getState('caseDetail.docketEntries')
      .find(doc => doc.eventCode === docketEntryEventCode).docketEntryId;

    expect(cerebralTest.getState('alertSuccess').message).toEqual(
      'Your entry has been added to docket record.',
    );

    expect(cerebralTest.getState('validationErrors')).toEqual({});
    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(cerebralTest.getState('form')).toEqual({});
  });
};
