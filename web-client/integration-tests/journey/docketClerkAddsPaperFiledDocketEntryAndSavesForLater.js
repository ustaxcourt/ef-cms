import {
  DOCUMENT_RELATIONSHIPS,
  OBJECTIONS_OPTIONS_MAP,
} from '../../../shared/src/business/entities/EntityConstants';
import { DocketEntryFactory } from '../../../shared/src/business/entities/docketEntry/DocketEntryFactory';
import { contactPrimaryFromState, waitForCondition } from '../helpers';

export const docketClerkAddsPaperFiledDocketEntryAndSavesForLater = (
  cerebralTest,
  fakeFile,
) => {
  const { VALIDATION_ERROR_MESSAGES } = DocketEntryFactory;

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

    const { contactId } = contactPrimaryFromState(cerebralTest);

    //primary document
    const docketEntryEventCode = 'M115';

    const motionToLeaveForFileWithSupportingDocument = [
      {
        key: 'dateReceivedMonth',
        value: 1,
      },
      {
        key: 'dateReceivedDay',
        value: 1,
      },
      {
        key: 'dateReceivedYear',
        value: 2018,
      },
      {
        key: 'primaryDocumentFile',
        value: fakeFile,
      },
      {
        key: 'primaryDocumentFileSize',
        value: 100,
      },
      {
        key: 'eventCode',
        value: docketEntryEventCode,
      },
      {
        key: 'objections',
        value: OBJECTIONS_OPTIONS_MAP.NO,
      },
      {
        key: 'secondaryDocument.eventCode',
        value: 'APPW',
      },
      {
        key: 'secondaryDocumentFile',
        value: fakeFile,
      },
      {
        key: 'secondaryDocumentFileSize',
        value: 100,
      },
      {
        key: 'secondaryDocument.additionalInfo',
        value: 'Test Secondary Additional Info',
      },
      {
        key: 'secondaryDocument.addToCoversheet',
        value: true,
      },
      {
        key: `filersMap.${contactId}`,
        value: true,
      },
    ];

    for (const item of motionToLeaveForFileWithSupportingDocument) {
      await cerebralTest.runSequence(
        'updateDocketEntryFormValueSequence',
        item,
      );
    }

    expect(cerebralTest.getState('form.documentType')).toEqual(
      'Motion for Leave to File',
    );

    await cerebralTest.runSequence('updateScreenMetadataSequence', {
      key: DOCUMENT_RELATIONSHIPS.SUPPORTING,
      value: false,
    });

    await cerebralTest.runSequence('updateScreenMetadataSequence', {
      key: DOCUMENT_RELATIONSHIPS.SUPPORTING,
      value: true,
    });

    await cerebralTest.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    await waitForCondition({
      booleanExpressionCondition: () =>
        cerebralTest.getState('currentPage') === 'CaseDetailInternal',
    });

    cerebralTest.docketEntryId = cerebralTest
      .getState('caseDetail.docketEntries')
      .find(doc => doc.eventCode === docketEntryEventCode).docketEntryId;

    expect(cerebralTest.getState('alertSuccess').message).toEqual(
      'Your entry has been added to the docket record.',
    );
    expect(cerebralTest.getState('validationErrors')).toEqual({});
    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(cerebralTest.getState('form')).toEqual({});
  });
};
