import { download, generateCsv, mkConfig } from 'export-to-csv';
import { exportTrialLocationEligibleCasesToCsvAction } from './exportTrialLocationEligibleCasesToCsvAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

jest.mock('export-to-csv', () => {
  return {
    mkConfig: jest.fn(config => config),
    generateCsv: jest.fn(() => jest.fn(() => 'MOCK_CSV_CONTENT')),
    download: jest.fn(() => jest.fn()),
  };
});

describe('exportTrialLocationEligibleCasesToCsvAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call mkConfig with the correct columns and filename', async () => {
    await runAction(exportTrialLocationEligibleCasesToCsvAction, {
      modules: { presenter },
      props: {
        eligibleCases: [],
        fileName: 'TestEligibleCases.csv',
      },
    });

    expect(mkConfig).toHaveBeenCalledTimes(1);
    expect(mkConfig).toHaveBeenCalledWith({
      columnHeaders: [
        { displayLabel: 'Docket No.', key: 'docketNumberWithSuffix' },
        { displayLabel: 'Case Title', key: 'caseTitle' },
        { displayLabel: 'Petitioner Counsel', key: 'privatePractitioners' },
        { displayLabel: 'Respondent Counsel', key: 'irsPractitioners' },
        { displayLabel: 'Case Type', key: 'caseType' },
      ],
      filename: 'TestEligibleCases.csv',
      useKeysAsHeaders: false,
    });
  });

  it('should transform privatePractitioners and irsPractitioners into space-separated strings', () => {
    const mockEligibleCases = [
      {
        caseTitle: 'Test Case 1',
        caseType: 'Regular',
        docketNumberWithSuffix: '101-23',
        irsPractitioners: [{ name: 'Respondent1' }, { name: 'Respondent2' }],
        privatePractitioners: [
          { name: 'PetrCounsel1' },
          { name: 'PetrCounsel2' },
        ],
      },
      {
        caseTitle: 'Test Case 2',
        caseType: 'Small',
        docketNumberWithSuffix: '102-23',
        irsPractitioners: [{ name: 'RespOne' }],
        privatePractitioners: [{ name: 'PetrOne' }, { name: 'PetrTwo' }],
      },
    ];

    runAction(exportTrialLocationEligibleCasesToCsvAction, {
      modules: { presenter },
      props: {
        eligibleCases: mockEligibleCases,
        fileName: 'EligibleCases.csv',
      },
    });

    expect(generateCsv).toHaveBeenCalledTimes(1);
    const generateCsvFn = generateCsv.mock.results[0].value;
    const transformedCases = mockEligibleCases.map(c => ({
      ...c,
      privatePractitioners:
        c.privatePractitioners.map(p => p.name).join(' ') + ' ',
      irsPractitioners: c.irsPractitioners.map(p => p.name).join(' ') + ' ',
    }));
    const [[actualTransformedCases]] = generateCsvFn.mock.calls;
    expect(actualTransformedCases).toEqual(transformedCases);
    expect(generateCsvFn.mock.results[0].value).toEqual('MOCK_CSV_CONTENT');
  });

  it('should call download with the CSV config and the generated CSV data', () => {
    const mockEligibleCases = [
      {
        caseTitle: 'Test Case 3',
        caseType: 'Regular',
        docketNumberWithSuffix: '200-99',
        irsPractitioners: [{ name: 'IrsCounsel' }],
        privatePractitioners: [{ name: 'PetrCounsel3' }],
      },
    ];

    runAction(exportTrialLocationEligibleCasesToCsvAction, {
      modules: { presenter },
      props: {
        eligibleCases: mockEligibleCases,
        fileName: 'FinalEligibleCases.csv',
      },
    });

    expect(download).toHaveBeenCalledTimes(1);
    const downloadReturnFn = download.mock.results[0].value;
    expect(downloadReturnFn).toHaveBeenCalledTimes(1);
    expect(downloadReturnFn.mock.calls[0][0]).toEqual('MOCK_CSV_CONTENT');
  });
});
