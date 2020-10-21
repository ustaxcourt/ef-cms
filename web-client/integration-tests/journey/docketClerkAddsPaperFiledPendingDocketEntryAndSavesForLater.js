import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const docketClerkAddsPaperFiledPendingDocketEntryAndSavesForLater = (
  test,
  fakeFile,
) => {
  const { DOCUMENT_RELATIONSHIPS } = applicationContext.getConstants();

  return it('Docketclerk adds paper filed docket entry and saves for later', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('gotoAddDocketEntrySequence', {
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
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'partyPrimary',
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

    await test.runSequence('fileDocketEntrySequence', {
      docketNumber: test.docketNumber,
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

    const caseDetailFormatted = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });

    expect(
      caseDetailFormatted.formattedPendingDocketEntriesOnDocketRecord,
    ).toEqual([]);
  });
};
