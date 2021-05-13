import { AUTOMATIC_BLOCKED_REASONS } from '../../../shared/src/business/entities/EntityConstants';
import { formattedDocketEntries as formattedDocketEntriesComputed } from '../../src/presenter/computeds/formattedDocketEntries';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedDocketEntries = withAppContextDecorator(
  formattedDocketEntriesComputed,
);

export const docketClerkEditsDocketEntryMeta = (test, docketRecordIndex) => {
  return it('docket clerk edits docket entry meta', async () => {
    expect(test.getState('currentPage')).toEqual('EditDocketEntryMeta');

    await test.runSequence('updateDocketEntryMetaDocumentFormValueSequence', {
      key: 'eventCode',
      value: 'REQA',
    });

    await test.runSequence('updateDocketEntryMetaDocumentFormValueSequence', {
      key: 'servedPartiesCode',
      value: 'B',
    });

    await test.runSequence('updateDocketEntryMetaDocumentFormValueSequence', {
      key: 'ordinalValue',
      value: 'First',
    });

    await test.runSequence('updateDocketEntryMetaDocumentFormValueSequence', {
      key: 'filingDate',
      value: '2020-01-04T05:00:00.000Z',
    });

    await test.runSequence('updateDocketEntryMetaDocumentFormValueSequence', {
      key: 'filingDateDay',
      value: '04',
    });

    await test.runSequence('updateDocketEntryMetaDocumentFormValueSequence', {
      key: 'filingDateMonth',
      value: '01',
    });

    await test.runSequence('updateDocketEntryMetaDocumentFormValueSequence', {
      key: 'filingDateYear',
      value: '2020',
    });

    await test.runSequence('updateDocketEntryMetaDocumentFormValueSequence', {
      key: 'partyIrsPractitioner',
      value: 'true',
    });

    await test.runSequence('updateDocketEntryMetaDocumentFormValueSequence', {
      key: 'action',
      value: 'Added new nickname of "Sauceboss"',
    });

    await test.runSequence('updateDocketEntryMetaDocumentFormValueSequence', {
      key: 'hasOtherFilingParty',
      value: true,
    });

    await test.runSequence('updateDocketEntryMetaDocumentFormValueSequence', {
      key: 'pending',
      value: true,
    });

    await test.runSequence('submitEditDocketEntryMetaSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('validationErrors')).toEqual({
      otherFilingParty: 'Enter other filing party name.',
    });

    await test.runSequence('updateDocketEntryMetaDocumentFormValueSequence', {
      key: 'otherFilingParty',
      value: 'Brianna Noble',
    });

    await test.runSequence('submitEditDocketEntryMetaSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('alertSuccess')).toMatchObject({
      message: 'Docket entry changes saved.',
    });

    expect(test.getState('caseDetail.automaticBlocked')).toEqual(true);
    expect(test.getState('caseDetail.automaticBlockedReason')).toEqual(
      AUTOMATIC_BLOCKED_REASONS.pending,
    );
    expect(test.getState('caseDetail.hasPendingItems')).toEqual(true);
    const docketEntries = test.getState('caseDetail.docketEntries');
    const pendingDocketEntry = docketEntries.find(
      d => d.index === docketRecordIndex,
    );

    expect(pendingDocketEntry.pending).toEqual(true);

    const helper = runCompute(formattedDocketEntries, {
      state: test.getState(),
    });

    test.updatedDocketEntryId = pendingDocketEntry.docketEntryId;

    expect(helper.formattedPendingDocketEntriesOnDocketRecord).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketEntryId: pendingDocketEntry.docketEntryId,
        }),
      ]),
    );
  });
};
