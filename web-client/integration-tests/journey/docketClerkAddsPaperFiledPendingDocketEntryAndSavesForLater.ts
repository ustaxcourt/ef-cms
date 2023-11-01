import { DOCUMENT_RELATIONSHIPS } from '../../../shared/src/business/entities/EntityConstants';
import { FORMATS } from '@shared/business/utilities/DateHandler';
import {
  contactPrimaryFromState,
  fakeFile,
  getFormattedDocketEntriesForTest,
  waitForCondition,
} from '../helpers';

export const docketClerkAddsPaperFiledPendingDocketEntryAndSavesForLater = (
  cerebralTest,
  caseDocketNumber?,
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

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'receivedAt',
        toFormat: FORMATS.ISO,
        value: '1/1/2018',
      },
    );

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
