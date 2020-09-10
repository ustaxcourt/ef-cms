import { DocketEntryFactory } from '../../../shared/src/business/entities/docketEntry/DocketEntryFactory';
import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';

export const docketClerkAddsDocketEntryWithoutFile = (test, overrides = {}) => {
  const { VALIDATION_ERROR_MESSAGES } = DocketEntryFactory;
  const { OBJECTIONS_OPTIONS_MAP } = applicationContext.getConstants();

  return it('Docketclerk adds docket entry data without a file', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('gotoAddDocketEntrySequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('fileDocketEntrySequence', {
      docketNumber: test.docketNumber,
      isSavingForLater: true,
    });

    expect(test.getState('validationErrors')).toEqual({
      dateReceived: VALIDATION_ERROR_MESSAGES.dateReceived[1],
      documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
      eventCode: VALIDATION_ERROR_MESSAGES.eventCode,
      partyPrimary: VALIDATION_ERROR_MESSAGES.partyPrimary,
    });

    //primary document
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedMonth',
      value: overrides.dateReceivedMonth || 1,
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedDay',
      value: overrides.dateReceivedDay || 1,
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedYear',
      value: overrides.dateReceivedYear || 2018,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'partyPrimary',
      value: true,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'ADMR',
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'documentType',
      value: 'Administrative Record',
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'objections',
      value: OBJECTIONS_OPTIONS_MAP.NO,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'hasOtherFilingParty',
      value: true,
    });

    await test.runSequence('fileDocketEntrySequence', {
      docketNumber: test.docketNumber,
      isSavingForLater: true,
    });

    expect(test.getState('validationErrors')).toEqual({
      otherFilingParty: VALIDATION_ERROR_MESSAGES.otherFilingParty,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'otherFilingParty',
      value: 'Brianna Noble',
    });

    await test.runSequence('fileDocketEntrySequence', {
      docketNumber: test.docketNumber,
      isSavingForLater: true,
    });

    expect(test.getState('validationErrors')).toEqual({});
  });
};
