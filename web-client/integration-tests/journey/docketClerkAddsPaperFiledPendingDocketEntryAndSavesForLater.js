import { DOCUMENT_RELATIONSHIPS } from '../../../shared/src/business/entities/EntityConstants';
import {
  contactPrimaryFromState,
  fakeFile,
  getFormattedDocketEntriesForTest,
  waitForCondition,
} from '../helpers';

export const docketClerkAddsPaperFiledPendingDocketEntryAndSavesForLater = (
  cerebralTest,
  caseDocketNumber,
) => {
  return it('docket clerk adds paper filed docket entry and saves for later', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: caseDocketNumber || cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('gotoAddPaperFilingSequence', {
      docketNumber: caseDocketNumber || cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('updateScreenMetadataSequence', {
      key: DOCUMENT_RELATIONSHIPS.SUPPORTING,
      value: false,
    });

    const paperFiledAnswer = [
      {
        key: 'dateReceivedMonth',
        value: 1,
      },
      {
        key: 'dateReceivedDay',
        value: 1,
      },
      {
        key: 'dateReceivedYear',
        value: 2018,
      },
      {
        key: 'primaryDocumentFile',
        value: fakeFile,
      },
      {
        key: 'primaryDocumentFileSize',
        value: 100,
      },
      {
        key: 'eventCode',
        value: 'A',
      },
      {
        key: 'pending',
        value: true,
      },
    ];

    for (const item of paperFiledAnswer) {
      await cerebralTest.runSequence(
        'updateDocketEntryFormValueSequence',
        item,
      );
    }

    const { contactId } = contactPrimaryFromState(cerebralTest);
    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: `filersMap.${contactId}`,
        value: true,
      },
    );

    await cerebralTest.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    await waitForCondition({
      booleanExpressionCondition: () =>
        cerebralTest.getState('currentPage') === 'CaseDetail',
    });

    cerebralTest.docketEntryId = cerebralTest
      .getState('caseDetail.docketEntries')
      .find(doc => doc.eventCode === 'A').docketEntryId;

    expect(cerebralTest.getState('alertSuccess').message).toEqual(
      'Your entry has been added to the docket record.',
    );

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(cerebralTest.getState('form')).toEqual({});

    const { formattedPendingDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);

    expect(formattedPendingDocketEntriesOnDocketRecord).toEqual([]);
  });
};
