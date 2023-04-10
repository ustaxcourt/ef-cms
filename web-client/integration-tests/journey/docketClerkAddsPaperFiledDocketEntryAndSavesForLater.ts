import { DOCUMENT_RELATIONSHIPS } from '../../../shared/src/business/entities/EntityConstants';
import { DocketEntryFactory } from '../../../shared/src/business/entities/docketEntry/DocketEntryFactory';
import { contactPrimaryFromState, waitForCondition } from '../helpers';

export const docketClerkAddsPaperFiledDocketEntryAndSavesForLater = ({
  cerebralTest,
  documentFormValues,
  expectedDocumentType,
}) => {
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

    for (const [key, value] of Object.entries(documentFormValues)) {
      await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
        key,
        value,
      });
    }

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: `filersMap.${contactId}`,
      value: true,
    });

    expect(cerebralTest.getState('form.documentType')).toEqual(
      expectedDocumentType,
    );

    if (documentFormValues.secondaryDocumentFile) {
      await cerebralTest.runSequence('updateScreenMetadataSequence', {
        key: DOCUMENT_RELATIONSHIPS.SUPPORTING,
        value: true,
      });
    }

    await cerebralTest.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await waitForCondition({
      booleanExpressionCondition: () =>
        cerebralTest.getState('currentPage') === 'CaseDetailInternal',
    });

    const docketEntries = cerebralTest.getState('caseDetail.docketEntries');

    cerebralTest.docketEntryId = docketEntries.find(
      doc => doc.eventCode === documentFormValues.eventCode,
    ).docketEntryId;

    expect(cerebralTest.getState('alertSuccess').message).toEqual(
      'Your entry has been added to the docket record.',
    );
    expect(cerebralTest.getState('validationErrors')).toEqual({});
    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(cerebralTest.getState('form')).toEqual({});
  });
};
