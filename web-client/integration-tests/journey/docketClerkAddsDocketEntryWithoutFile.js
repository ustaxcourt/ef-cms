import { DocketEntryFactory } from '../../../shared/src/business/entities/docketEntry/DocketEntryFactory';
import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import {
  contactPrimaryFromState,
  getFormattedDocketEntriesForTest,
} from '../helpers';

export const docketClerkAddsDocketEntryWithoutFile = (
  cerebralTest,
  overrides = {},
) => {
  const { VALIDATION_ERROR_MESSAGES } = DocketEntryFactory;
  const { OBJECTIONS_OPTIONS_MAP } = applicationContext.getConstants();

  return it('Docketclerk adds docket entry data without a file', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('gotoAddPaperFilingSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    expect(cerebralTest.getState('validationErrors')).toEqual({
      dateReceived: VALIDATION_ERROR_MESSAGES.dateReceived[1],
      documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
      eventCode: VALIDATION_ERROR_MESSAGES.eventCode,
      filers: VALIDATION_ERROR_MESSAGES.filers,
    });

    //primary document
    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedMonth',
      value: overrides.dateReceivedMonth || 1,
    });
    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedDay',
      value: overrides.dateReceivedDay || 1,
    });
    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedYear',
      value: overrides.dateReceivedYear || 2018,
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
      value: 'ADMR',
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'documentType',
      value: 'Administrative Record',
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'objections',
      value: OBJECTIONS_OPTIONS_MAP.NO,
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'hasOtherFilingParty',
      value: true,
    });

    await cerebralTest.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    expect(cerebralTest.getState('validationErrors')).toEqual({
      otherFilingParty: VALIDATION_ERROR_MESSAGES.otherFilingParty,
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'otherFilingParty',
      value: 'Brianna Noble',
    });

    await cerebralTest.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    expect(cerebralTest.getState('validationErrors')).toEqual({});
    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');

    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);

    cerebralTest.docketRecordEntry = formattedDocketEntriesOnDocketRecord.find(
      entry => entry.documentTitle === 'Administrative Record',
    );

    expect(cerebralTest.docketRecordEntry.index).toBeFalsy();
  });
};
