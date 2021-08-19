import {
  AUTOMATIC_BLOCKED_REASONS,
  OBJECTIONS_OPTIONS_MAP,
} from '../../../shared/src/business/entities/EntityConstants';

export const docketClerkEditsDocketEntryMetaWithNewFreeText = (
  cerebralTest,
  docketRecordIndex,
) => {
  return it('docket clerk edits docket entry meta', async () => {
    expect(cerebralTest.getState('currentPage')).toEqual('EditDocketEntryMeta');

    await cerebralTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'freeText',
        value: 'The Sauceboss',
      },
    );

    await cerebralTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'filingDate',
        value: '2020-01-04T05:00:00.000Z',
      },
    );

    await cerebralTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'filingDateDay',
        value: '04',
      },
    );

    await cerebralTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'filingDateMonth',
        value: '01',
      },
    );

    await cerebralTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'filingDateYear',
        value: '2020',
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

    await cerebralTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'objections',
        value: OBJECTIONS_OPTIONS_MAP.NO,
      },
    );

    await cerebralTest.runSequence('submitEditDocketEntryMetaSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('validationErrors')).toEqual({
      otherFilingParty: 'Enter other filing party name.',
    });

    await cerebralTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'otherFilingParty',
        value: 'Brianna Noble',
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
    expect(pendingDocketEntry.documentTitle).toEqual(
      'Application to Take Deposition of The Sauceboss',
    );
  });
};
