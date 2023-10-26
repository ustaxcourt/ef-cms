import { FORMATS } from '@shared/business/utilities/DateHandler';
import { OBJECTIONS_OPTIONS_MAP } from '../../../shared/src/business/entities/EntityConstants';
import {
  contactPrimaryFromState,
  getFormattedDocketEntriesForTest,
  waitForCondition,
} from '../helpers';

export const docketClerkAddsDocketEntryWithoutFile = (
  cerebralTest,
  overrides = {},
) => {
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
      documentType: 'Select a document type',
      eventCode: 'Select a document type',
      filers: 'Select a filing party',
      receivedAt: 'Enter a valid date received',
    });

    const { contactId } = contactPrimaryFromState(cerebralTest);
    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: `filersMap.${contactId}`,
        value: true,
      },
    );

    const administrativeRecord = [
      {
        key: 'eventCode',
        value: 'ADMR',
      },
      {
        key: 'documentType',
        value: 'Administrative Record',
      },
      {
        key: 'objections',
        value: OBJECTIONS_OPTIONS_MAP.NO,
      },
      {
        key: 'hasOtherFilingParty',
        value: true,
      },
    ];

    for (const item of administrativeRecord) {
      await cerebralTest.runSequence(
        'updateDocketEntryFormValueSequence',
        item,
      );
    }

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'receivedAt',
        toFormat: FORMATS.ISO,
        value: `${overrides.receivedAtMonth || 1}/${
          overrides.receivedAtDay || 1
        }/${overrides.receivedAtYear || 2018}`,
      },
    );

    await cerebralTest.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    expect(cerebralTest.getState('validationErrors')).toEqual({
      otherFilingParty: 'Enter other filing party name.',
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'otherFilingParty',
      value: 'Brianna Noble',
    });

    await cerebralTest.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    await waitForCondition({
      booleanExpressionCondition: () =>
        cerebralTest.getState('currentPage') === 'CaseDetailInternal',
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
