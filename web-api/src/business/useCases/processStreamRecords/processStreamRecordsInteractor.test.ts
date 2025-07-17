jest.mock('./processStreamUtilities');
jest.mock('./processDocketEntries');
jest.mock('./processPractitionerMappingEntries');
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';
import { processDocketEntries } from './processDocketEntries';
import { processStreamRecordsInteractor } from './processStreamRecordsInteractor';

const logger = getDawsonLogger();
const errorSpy = jest.spyOn(logger, 'error');

describe('processStreamRecordsInteractor', () => {
  beforeAll(() => {
    (processDocketEntries as jest.Mock).mockResolvedValue([]);
  });

  it('should log an error, throw an exception, and halt further execution when processDocketEntries fails', async () => {
    (processDocketEntries as jest.Mock).mockRejectedValueOnce(new Error());

    await expect(
      processStreamRecordsInteractor(applicationContext, {
        recordsToProcess: [],
      }),
    ).rejects.toThrow();

    expect(processDocketEntries).toHaveBeenCalled(); // the one that throws an error
    expect(errorSpy).toHaveBeenCalled();
  });
});
