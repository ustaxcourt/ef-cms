import { AUTOMATIC_BLOCKED_REASONS } from '../../../shared/src/business/entities/EntityConstants';
import { FORMATS } from '@shared/business/utilities/DateHandler';
import { getFormattedDocketEntriesForTest } from '../helpers';

export const docketClerkEditsDocketEntryMeta = (
  cerebralTest,
  docketRecordIndex,
  data = {},
) => {
  return it('docket clerk edits docket entry meta', async () => {
    expect(cerebralTest.getState('currentPage')).toEqual('EditDocketEntryMeta');

    await cerebralTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'eventCode',
        value: 'REQA',
      },
    );

    await cerebralTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'servedPartiesCode',
        value: 'B',
      },
    );

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'ordinalValue',
      value: 'Other',
    });
    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'otherIteration',
      value: '16',
    });

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'filingDate',
        toFormat: FORMATS.ISO,
        value: '01/04/2020',
      },
    );

    await cerebralTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'partyIrsPractitioner',
        value: 'true',
      },
    );

    await cerebralTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'action',
        value: 'Added new nickname of "Sauceboss"',
      },
    );

    await cerebralTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'hasOtherFilingParty',
        value: true,
      },
    );

    await cerebralTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'pending',
        value: true,
      },
    );

    await cerebralTest.runSequence('submitEditDocketEntryMetaSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('validationErrors')).toEqual({
      otherFilingParty: 'Enter other filing party name.',
    });

    // note: this is not possible if the docket entry is already served
    await cerebralTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'otherFilingParty',
        value: 'Brianna Noble',
      },
    );

    await cerebralTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'filedBy',
        value: data.filedBy || 'Resp. & Petr. Mona Schultz, Brianna Noble',
      },
    );

    await cerebralTest.runSequence('submitEditDocketEntryMetaSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('alertSuccess')).toMatchObject({
      message: 'Docket entry changes saved.',
    });

    expect(cerebralTest.getState('caseDetail.automaticBlocked')).toEqual(true);
    expect(cerebralTest.getState('caseDetail.automaticBlockedReason')).toEqual(
      AUTOMATIC_BLOCKED_REASONS.pending,
    );
    expect(cerebralTest.getState('caseDetail.hasPendingItems')).toEqual(true);
    const docketEntries = cerebralTest.getState('caseDetail.docketEntries');
    const pendingDocketEntry = docketEntries.find(
      d => d.index === docketRecordIndex,
    );

    expect(pendingDocketEntry.pending).toEqual(true);

    const { formattedPendingDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);

    cerebralTest.updatedDocketEntryId = pendingDocketEntry.docketEntryId;

    expect(formattedPendingDocketEntriesOnDocketRecord).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketEntryId: pendingDocketEntry.docketEntryId,
        }),
      ]),
    );
  });
};
