import { contactPrimaryFromState, refreshElasticsearchIndex } from '../helpers';
import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed);

export const docketClerkAddsMiscellaneousPaperFiling = (
  cerebralTest,
  fakeFile,
) => {
  return it('DocketClerk adds miscellaneous paper filing', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('gotoAddPaperFilingSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const docketEntryFormValues = {
      dateReceivedDay: 30,
      dateReceivedMonth: 4,
      dateReceivedYear: 2001,
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

    await refreshElasticsearchIndex();

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('alertSuccess').message).toEqual(
      'Your entry has been added to the docket record.',
    );

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(cerebralTest.getState('form')).toEqual({});

    const miscellaneousDocument = cerebralTest
      .getState('caseDetail.docketEntries')
      .find(doc => doc.eventCode === 'MISC');

    expect(miscellaneousDocument.documentTitle).not.toContain('Miscellaneous');
    expect(miscellaneousDocument.documentTitle).toEqual('A title');

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
