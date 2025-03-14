import { download, generateCsv, mkConfig } from 'export-to-csv';
import { exportTrialLocationBlockedCasesToCsvAction } from './exportTrialLocationBlockedCasesToCsvAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

jest.mock('export-to-csv', () => {
  return {
    mkConfig: jest.fn(config => config),
    generateCsv: jest.fn(() => jest.fn(() => 'MOCK_CSV_CONTENT')),
    download: jest.fn(() => jest.fn()),
  };
});

describe('exportTrialLocationBlockedCasesToCsvAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call mkConfig with the correct columns and filename', () => {
    runAction(exportTrialLocationBlockedCasesToCsvAction, {
      modules: {
        presenter,
      },
      props: {
        blockedCases: [],
        fileName: 'TestBlockedCases.csv',
      },
    });

    expect(mkConfig).toHaveBeenCalledTimes(1);
    expect(mkConfig).toHaveBeenCalledWith({
      columnHeaders: [
        { displayLabel: 'Docket No.', key: 'docketNumberWithSuffix' },
        { displayLabel: 'Date Blocked', key: 'blockedDateEarliest' },
        { displayLabel: 'Case Title', key: 'caseTitle' },
        { displayLabel: 'Case Status', key: 'status' },
        { displayLabel: 'Reason', key: 'blockedReason' },
      ],
      filename: 'TestBlockedCases.csv',
      useKeysAsHeaders: false,
    });
  });

  it('should transform blockedReason from automaticBlockedReason if blockedReason is null', () => {
    const mockBlockedCases = [
      {
        docketNumberWithSuffix: '101-23',
        blockedDateEarliest: '2023-01-01',
        caseTitle: 'A test case',
        status: 'New',
        blockedReason: null,
        automaticBlockedReason: 'Auto reason 1',
      },
      {
        docketNumberWithSuffix: '102-23',
        blockedDateEarliest: '2023-02-02',
        caseTitle: 'Another test case',
        status: 'General Docket',
        blockedReason: 'Manual reason 2',
        automaticBlockedReason: 'Auto reason 2',
      },
    ];

    runAction(exportTrialLocationBlockedCasesToCsvAction, {
      modules: {
        presenter,
      },
      props: {
        blockedCases: mockBlockedCases,
        fileName: 'BlockedCases.csv',
      },
    });

    expect(generateCsv).toHaveBeenCalledTimes(1);

    const generateCsvReturnFn = generateCsv.mock.results[0].value;
    const transformedCases = mockBlockedCases.map(c => ({
      ...c,
      blockedReason: c.blockedReason || c.automaticBlockedReason,
    }));
    const generateCsvInnerCall = generateCsvReturnFn.mock.calls[0];

    expect(generateCsvInnerCall[0]).toEqual(transformedCases);
    expect(generateCsvReturnFn.mock.results[0].value).toEqual(
      'MOCK_CSV_CONTENT',
    );
  });

  it('should call download with the CSV config and the generated CSV data', () => {
    const mockBlockedCases = [
      {
        docketNumberWithSuffix: '200-99',
        blockedDateEarliest: '2023-03-03',
        caseTitle: 'Final test case',
        status: 'Closed',
        blockedReason: 'Manual reason 3',
        automaticBlockedReason: 'Auto reason 3',
      },
    ];

    runAction(exportTrialLocationBlockedCasesToCsvAction, {
      modules: {
        presenter,
      },
      props: {
        blockedCases: mockBlockedCases,
        fileName: 'FinalCases.csv',
      },
    });

    expect(download).toHaveBeenCalledTimes(1);
    const downloadReturnFn = download.mock.results[0].value;
    expect(downloadReturnFn).toHaveBeenCalledTimes(1);
    expect(downloadReturnFn.mock.calls[0][0]).toEqual('MOCK_CSV_CONTENT');
  });
});
