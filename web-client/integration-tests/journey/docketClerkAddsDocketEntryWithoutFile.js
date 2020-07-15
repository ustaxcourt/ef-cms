import { DocketEntryFactory } from '../../../shared/src/business/entities/docketEntry/DocketEntryFactory';

const { VALIDATION_ERROR_MESSAGES } = DocketEntryFactory;

export const docketClerkAddsDocketEntryWithoutFile = test => {
  return it('Docketclerk adds docket entry data without a file', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('gotoAddDocketEntrySequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('saveForLaterDocketEntrySequence', {
      docketNumber: test.docketNumber,
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
      value: 1,
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedDay',
      value: 1,
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedYear',
      value: 2018,
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
      value: 'No',
    });
  });
};
