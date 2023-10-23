import { FORMATS } from '@shared/business/utilities/DateHandler';
import {
  contactPrimaryFromState,
  fakeFile,
  refreshElasticsearchIndex,
  waitForCondition,
} from '../helpers';
import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkAddsMiscellaneousPaperFiling = cerebralTest => {
  const formattedWorkQueue = withAppContextDecorator(
    formattedWorkQueueComputed,
  );

  return it('DocketClerk adds miscellaneous paper filing', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('gotoAddPaperFilingSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const docketEntryFormValues = {
      eventCode: 'MISC',
      freeText: 'A title',
      primaryDocumentFile: fakeFile,
      primaryDocumentFileSize: 100,
    };

    for (const [key, value] of Object.entries(docketEntryFormValues)) {
      await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
        key,
        value,
      });
    }

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      { key: 'receivedAt', toFormat: FORMATS.ISO, value: '04/30/2001' },
    );

    const contactPrimary = contactPrimaryFromState(cerebralTest);
    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: `filersMap.${contactPrimary.contactId}`,
        value: true,
      },
    );

    await cerebralTest.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await waitForCondition({
      booleanExpressionCondition: () =>
        cerebralTest.getState('currentPage') === 'CaseDetailInternal',
    });

    expect(cerebralTest.getState('alertSuccess').message).toEqual(
      'Your entry has been added to the docket record.',
    );

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(cerebralTest.getState('form')).toEqual({});

    const miscellaneousDocument = cerebralTest
      .getState('caseDetail.docketEntries')
      .find(doc => doc.eventCode === 'MISC');

    cerebralTest.docketEntryId = miscellaneousDocument.docketEntryId;

    expect(miscellaneousDocument.documentTitle).not.toContain('Miscellaneous');
    expect(miscellaneousDocument.documentTitle).toEqual('A title');

    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('gotoWorkQueueSequence');
    expect(cerebralTest.getState('currentPage')).toEqual('WorkQueue');
    await cerebralTest.runSequence('chooseWorkQueueSequence', {
      box: 'inProgress',
      queue: 'my',
    });

    const formattedQueue = runCompute(formattedWorkQueue, {
      state: cerebralTest.getState(),
    });

    const miscellaneousWorkItem = formattedQueue.find(
      workItem => workItem.docketNumber === cerebralTest.docketNumber,
    );

    expect(miscellaneousWorkItem.editLink).toContain('/complete');
  });
};
