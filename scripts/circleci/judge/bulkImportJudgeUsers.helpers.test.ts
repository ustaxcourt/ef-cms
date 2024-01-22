import { CSV_HEADERS, init } from './bulkImportJudgeUsers.helpers';
import { readCsvFile } from '../../../web-api/importHelpers';
import axios from 'axios';

jest.mock('../../../web-api/importHelpers', () => ({
  getServices: jest.fn().mockResolvedValue({
    gateway_api: 'http://example.com',
  }),
  getToken: jest.fn().mockResolvedValue('mock-token-123'),
  readCsvFile: jest.fn(),
}));
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

let mockLegacyJudge;
let mockCurrentJudge;

describe('bulkImportJudgeUsers helpers', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    mockLegacyJudge = {
      email: 'judgefieri@example.com',
      judgeFullName: 'Fieri',
      judgeTitle: 'Judge',
      name: 'Fieri',
      role: 'legacyJudge',
      section: 'legacyJudgesChambers',
      userId: 'dadbad42-18d0-43ec-bafb-654e83405416',
    };

    mockCurrentJudge = {
      email: 'judgedredd@example.com',
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

    (readCsvFile as jest.Mock).mockReturnValue(csvOutput);
    mockedAxios.post.mockImplementation(() =>
      Promise.resolve({ data: { userId: 123 }, status: 200 }),
    );
  });

  describe('init', () => {
    it('imports the csv file to process records', async () => {
      await init('path/to/file', {});
      expect(readCsvFile).toHaveBeenCalled();
    });

    it('calls the endpoint to create a new jduge user record in persistence', async () => {
      await init('path/to/file', {});
      expect(mockedAxios.post).toHaveBeenCalledTimes(2);
    });

    it('invokes the local running service if env is local', async () => {
      process.env.ENV = 'local';
      await init('path/to/file', {});
      expect(mockedAxios.post).toHaveBeenCalledTimes(2);
    });

    it('logs an error if post request returns non 200 status code', async () => {
      await init('path/to/file', {});
      mockedAxios.post.mockImplementation(() =>
        Promise.resolve({ status: 200 }),
      );
      expect(mockedAxios.post).toHaveBeenCalledTimes(2);
    });
  });
});
