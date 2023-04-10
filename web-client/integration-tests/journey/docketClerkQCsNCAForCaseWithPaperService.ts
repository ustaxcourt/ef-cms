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

export const docketClerkQCsNCAForCaseWithPaperService = cerebralTest => {
  const { SERVICE_INDICATOR_TYPES } = applicationContext.getConstants();

  return it('Docket Clerk QCs NCA for case with paper service', async () => {
    await refreshElasticsearchIndex();

    cerebralTest.setState('caseDetail', {});
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });
    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');

    const contactPrimary = contactPrimaryFromState(cerebralTest);
    expect(contactPrimary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_PAPER,
    );

    await cerebralTest.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
    });
    const workQueueFormatted = runCompute(formattedWorkQueue, {
      state: cerebralTest.getState(),
    });

    const noticeOfChangeOfAddressQCItem = workQueueFormatted.find(
      workItem => workItem.docketNumber === cerebralTest.docketNumber,
    );

    expect(noticeOfChangeOfAddressQCItem).toMatchObject({
      docketEntry: { documentTitle: 'Notice of Change of Address' },
    });

    let { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);

    const lastIndex = formattedDocketEntriesOnDocketRecord.length - 1;
    noticeOfChangeOfAddressQCItem.index =
      noticeOfChangeOfAddressQCItem.index || lastIndex;

    const { docketEntryId } =
      formattedDocketEntriesOnDocketRecord[noticeOfChangeOfAddressQCItem.index];

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
