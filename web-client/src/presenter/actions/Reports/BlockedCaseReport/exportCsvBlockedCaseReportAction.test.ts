import {
  BlockedCsvCase,
  exportCsvBlockedCaseReportAction,
} from './exportCsvBlockedCaseReportAction';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('exportCsvBlockedCaseReportAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should UPDATE TEST NAME', async () => {
    const blockedCases: BlockedCsvCase[] = [
      {
        automaticBlockedReason: 'TEST_automaticBlockedReason',
        blockedDateEarliest: 'TEST_blockedDateEarliest',
        blockedReason: 'TEST_blockedReason',
        caseTitle: 'TEST_caseTitle',
        docketNumber: 'TEST_docketNumber',
        status: 'New',
      },
    ];
    const trialLocation: string = 'Birmingham, Alabama';

    await runAction(exportCsvBlockedCaseReportAction, {
      modules: {
        presenter,
      },
      props: {
        blockedCases,
        trialLocation,
      },
    });

    const downloadCsvFileCalls = applicationContext.downloadCsvFile.mock.calls;
    expect(downloadCsvFileCalls.length).toEqual(1);
    expect(downloadCsvFileCalls[0][0]).toEqual([
      {
        allReasons: 'TEST_blockedReason TEST_automaticBlockedReason',
        automaticBlockedReason: 'TEST_automaticBlockedReason',
        blockedDateEarliest: 'TEST_blockedDateEarliest',
        blockedReason: 'TEST_blockedReason',
        caseTitle: 'TEST_caseTitle',
        docketNumber: 'TEST_docketNumber',
        status: 'New',
      },
    ]);
    expect(downloadCsvFileCalls[0][1]).toEqual({
      columnHeaders: [
        {
          displayLabel: 'Docket No.',
          key: 'docketNumber',
        },
        {
          displayLabel: 'Date Blocked',
          key: 'blockedDateEarliest',
        },
        {
          displayLabel: 'Case Title',
          key: 'caseTitle',
        },
        {
          displayLabel: 'Case Status',
          key: 'status',
        },
        {
          displayLabel: 'Reason',
          key: 'allReasons',
        },
      ],
      filename: 'Blocked Cases Report - Birmingham_Alabama 08_22_2024',
      useKeysAsHeaders: false,
    });
  });
});
