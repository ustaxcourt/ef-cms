import { addDocketEntryHelper as addDocketEntryHelperComputed } from '../../src/presenter/computeds/addDocketEntryHelper';
import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import {
  contactPrimaryFromState,
  getFormattedDocketEntriesForTest,
  refreshElasticsearchIndex,
} from '../helpers';
import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed);

export const docketClerkQCsNCAForCaseWithPaperService = test => {
  const { SERVICE_INDICATOR_TYPES } = applicationContext.getConstants();

  return it('Docket Clerk QCs NCA for case with paper service', async () => {
    await refreshElasticsearchIndex();

    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    const contactPrimary = contactPrimaryFromState(test);
    expect(contactPrimary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_PAPER,
    );

    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
    });
    const workQueueFormatted = runCompute(formattedWorkQueue, {
      state: test.getState(),
    });

    const noticeOfChangeOfAddressQCItem = workQueueFormatted.find(
      workItem => workItem.docketNumber === test.docketNumber,
    );

    expect(noticeOfChangeOfAddressQCItem).toMatchObject({
      docketEntry: { documentTitle: 'Notice of Change of Address' },
    });

    let { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(test);

    const lastIndex = formattedDocketEntriesOnDocketRecord.length - 1;
    noticeOfChangeOfAddressQCItem.index =
      noticeOfChangeOfAddressQCItem.index || lastIndex;

    const { docketEntryId } =
      formattedDocketEntriesOnDocketRecord[noticeOfChangeOfAddressQCItem.index];

    await test.runSequence('gotoDocketEntryQcSequence', {
      docketEntryId,
      docketNumber: formattedDocketEntriesOnDocketRecord.docketNumber,
    });

    const addDocketEntryHelper = withAppContextDecorator(
      addDocketEntryHelperComputed,
    );

    const { showFilingPartiesForm } = runCompute(addDocketEntryHelper, {
      state: test.getState(),
    });

    expect(showFilingPartiesForm).toBe(false);

    await test.runSequence('completeDocketEntryQCSequence');

    expect(test.getState('validationErrors')).toEqual({});

    ({ formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(test));

    const selectedDocument = formattedDocketEntriesOnDocketRecord.find(
      document => document.docketEntryId === docketEntryId,
    );

    expect(selectedDocument.qcWorkItemsCompleted).toEqual(true);
  });
};
