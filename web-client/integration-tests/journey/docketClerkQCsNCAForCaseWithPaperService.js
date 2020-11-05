import { addDocketEntryHelper as addDocketEnryHelperComputed } from '../../src/presenter/computeds/addDocketEntryHelper';
import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed);
const addDocketEntryHelper = withAppContextDecorator(addDocketEntryHelper);

export const docketClerkQCsNCAForCaseWithPaperService = test => {
  const { SERVICE_INDICATOR_TYPES } = applicationContext.getConstants();

  return it('Docket Clerk QCs NCA for case with paper service', async () => {
    await refreshElasticsearchIndex();

    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    const caseWithPaperService = test.getState('caseDetail');

    expect(caseWithPaperService.contactPrimary.serviceIndicator).toEqual(
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

    let caseDetailFormatted;
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    const lastIndex =
      caseDetailFormatted.formattedDocketEntriesOnDocketRecord.length - 1;
    noticeOfChangeOfAddressQCItem.index =
      noticeOfChangeOfAddressQCItem.index || lastIndex;

    const {
      docketEntryId,
    } = caseDetailFormatted.formattedDocketEntriesOnDocketRecord[
      noticeOfChangeOfAddressQCItem.index
    ];

    await test.runSequence('gotoEditDocketEntrySequence', {
      docketEntryId,
      docketNumber: caseDetailFormatted.docketNumber,
    });

    const addDocketEnryHelper = withAppContextDecorator(
      addDocketEnryHelperComputed,
    );

    const { showFilingPartiesForm } = runCompute(addDocketEnryHelper, {
      state: test.getState(),
    });

    expect(showFilingPartiesForm).toBe(false);

    await test.runSequence('completeDocketEntryQCSequence');

    expect(test.getState('validationErrors')).toEqual({});

    caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    const selectedDocument = caseDetailFormatted.formattedDocketEntriesOnDocketRecord.find(
      document => document.docketEntryId === docketEntryId,
    );

    expect(selectedDocument.qcWorkItemsCompleted).toEqual(true);
  });
};
