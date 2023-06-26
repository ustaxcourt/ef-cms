import { addDocketEntryHelper as addDocketEntryHelperComputed } from '../../src/presenter/computeds/addDocketEntryHelper';
import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import {
  getFormattedDocketEntriesForTest,
  refreshElasticsearchIndex,
} from '../helpers';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed);

export const docketClerkQCsNoticeOfChange = ({
  cerebralTest,
  documentTitle,
}) => {
  return it(`Docket Clerk QCs ${documentTitle}`, async () => {
    await refreshElasticsearchIndex();

    cerebralTest.setState('caseDetail', {});
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });
    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');

    await cerebralTest.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
    });
    const workQueueFormatted = runCompute(formattedWorkQueue, {
      state: cerebralTest.getState(),
    });
    const noticeOfChangeQCItem = workQueueFormatted.find(
      workItem => workItem.docketNumber === cerebralTest.docketNumber,
    );

    expect(noticeOfChangeQCItem).toMatchObject({
      docketEntry: { documentTitle },
    });

    let { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);

    const lastIndex = formattedDocketEntriesOnDocketRecord.length - 1;
    noticeOfChangeQCItem.index = noticeOfChangeQCItem.index || lastIndex;

    const { docketEntryId } =
      formattedDocketEntriesOnDocketRecord[noticeOfChangeQCItem.index];

    await cerebralTest.runSequence('gotoDocketEntryQcSequence', {
      docketEntryId,
      docketNumber: formattedDocketEntriesOnDocketRecord.docketNumber,
    });

    const addDocketEntryHelper = withAppContextDecorator(
      addDocketEntryHelperComputed,
    );

    const { showFilingPartiesForm } = runCompute(addDocketEntryHelper, {
      state: cerebralTest.getState(),
    });

    expect(showFilingPartiesForm).toBe(false);

    await cerebralTest.runSequence('completeDocketEntryQCSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    ({ formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest));

    const selectedDocument = formattedDocketEntriesOnDocketRecord.find(
      document => document.docketEntryId === docketEntryId,
    );

    expect(selectedDocument.qcWorkItemsCompleted).toEqual(true);
  });
};
