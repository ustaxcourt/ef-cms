import {
  BlockedCsvCase,
  exportCsvBlockedCaseReportAction,
} from './exportCsvBlockedCaseReportAction';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('exportCsvBlockedCaseReportAction', () => {
  beforeEach(() => {
    applicationContext.createCsvString = jest.fn().mockReturnValue('TEST_CSV');
    applicationContext.getUtilities().downloadCsv = jest.fn();
    presenter.providers.applicationContext = applicationContext;
  });

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

    const createCsvStringCalls = applicationContext.createCsvString.mock.calls;
    expect(createCsvStringCalls.length).toEqual(1);
    expect(createCsvStringCalls[0][0]).toEqual([
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
    expect(createCsvStringCalls[0][1]).toEqual([
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
    ]);

    const downloadCsvCalls =
      applicationContext.getUtilities().downloadCsv.mock.calls;
    expect(downloadCsvCalls.length).toEqual(1);
    expect(downloadCsvCalls[0][0]).toEqual({
      csvString: 'TEST_CSV',
      fileName: expect.stringContaining(
        'Blocked Cases Report - Birmingham_Alabama',
      ),
    });
  });
});
