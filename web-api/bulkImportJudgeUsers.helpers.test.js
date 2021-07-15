const { CSV_HEADERS, init } = require('./bulkImportJudgeUsers.helpers');

jest.mock('./importHelpers', () => ({
  getServices: jest.fn().mockResolvedValue({
    gateway_api: 'http://example.com',
  }),
  getToken: jest.fn().mockResolvedValue('mock-token-123'),
  readCsvFile: jest.fn(),
}));
jest.mock('axios');

const axios = require('axios');
const { readCsvFile } = require('./importHelpers');

let mockLegacyJudge;
let mockCurrentJudge;

describe('bulkImportJudgeUsers helpers', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    mockLegacyJudge = {
      email: 'judgeFieri@example.com',
      judgeFullName: 'Fieri',
      judgeTitle: 'Legacy Judge',
      name: 'Fieri',
      role: 'legacyJudge',
      section: 'legacyJudgesChambers',
      userId: 'dadbad42-18d0-43ec-bafb-654e83405416',
    };

    mockCurrentJudge = {
      email: 'judgeDredd@example.com',
      judgeFullName: 'Joseph S. Dredd',
      judgeTitle: 'Judge',
      name: 'Dredd',
      role: 'judge',
      section: 'dreddsChambers',
      userId: 'dabbad00-18d0-43ec-bafb-654e83405416',
    };

    const joinRowData = data => {
      const rowData = Object.values(CSV_HEADERS).map(header => {
        return data[header];
      });
      return rowData.join(',');
    };

    const csvOutput = `${CSV_HEADERS.join(',')}
      ${joinRowData(mockLegacyJudge)}
      ${joinRowData(mockCurrentJudge)}
      `;

    readCsvFile.mockReturnValue(csvOutput);
    axios.post.mockImplementation(() => Promise.resolve({ status: 200 }));
  });

  describe('init', () => {
    it('imports the csv file to process records', async () => {
      await init({});
      expect(readCsvFile).toHaveBeenCalled();
    });

    it('calls the endpoint to create a new jduge user record in persistence', async () => {
      await init({});
      expect(axios.post).toHaveBeenCalledTimes(2);
    });
  });
});
