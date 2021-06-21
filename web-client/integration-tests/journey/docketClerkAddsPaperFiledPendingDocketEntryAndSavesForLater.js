import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import {
  contactPrimaryFromState,
  getFormattedDocketEntriesForTest,
} from '../helpers';

export const docketClerkAddsPaperFiledPendingDocketEntryAndSavesForLater = (
  test,
  fakeFile,
) => {
  const { DOCUMENT_RELATIONSHIPS } = applicationContext.getConstants();

  return it('Docketclerk adds paper filed docket entry and saves for later', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('gotoAddPaperFilingSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('updateScreenMetadataSequence', {
      key: DOCUMENT_RELATIONSHIPS.SUPPORTING,
      value: false,
    });

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
      key: 'primaryDocumentFile',
      value: fakeFile,
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'primaryDocumentFileSize',
      value: 100,
    });
    const contactPrimary = contactPrimaryFromState(test);

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: `filersMap.${contactPrimary.contactId}`,
      value: true,
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'A',
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'pending',
      value: true,
    });

    await test.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    test.docketEntryId = test
      .getState('caseDetail.docketEntries')
      .find(doc => doc.eventCode === 'A').docketEntryId;

    expect(test.getState('alertSuccess').message).toEqual(
      'Your entry has been added to docket record.',
    );

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(test.getState('form')).toEqual({});

    const { formattedPendingDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(test);

    expect(formattedPendingDocketEntriesOnDocketRecord).toEqual([]);
  });
};
