jest.mock('./processStreamUtilities');
jest.mock('./processPractitionerMappingEntries');
jest.mock('./processRemoveEntries');
jest.mock('./processOtherEntries');
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';
import { partitionRecords } from './processStreamUtilities';
import { processOtherEntries } from './processOtherEntries';
import { processPractitionerMappingEntries } from './processPractitionerMappingEntries';
import { processRemoveEntries } from './processRemoveEntries';
import { processStreamRecordsInteractor } from './processStreamRecordsInteractor';

const logger = getDawsonLogger();
const errorSpy = jest.spyOn(logger, 'error');

describe('processStreamRecordsInteractor', () => {
  beforeAll(() => {
    (processRemoveEntries as jest.Mock).mockResolvedValue([]);
    (processPractitionerMappingEntries as jest.Mock).mockResolvedValue([]);
    (processOtherEntries as jest.Mock).mockResolvedValue([]);

    (partitionRecords as jest.Mock).mockReturnValue({
      irsPractitionerMappingRecords: [],
      otherRecords: [],
      privatePractitionerMappingRecords: [],
      removeRecords: [],
    });
  });

  it('should partition incoming records by type', async () => {
    await processStreamRecordsInteractor(applicationContext, {
      recordsToProcess: [],
    });

    expect(partitionRecords).toHaveBeenCalledWith([]);
  });

  it('should log an error, throw an exception, and halt further execution when processRemoveEntries fails', async () => {
    (processRemoveEntries as jest.Mock).mockRejectedValueOnce(new Error());

    await expect(
      processStreamRecordsInteractor(applicationContext, {
        recordsToProcess: [],
      }),
    ).rejects.toThrow();

    expect(processRemoveEntries).toHaveBeenCalled(); // the one that throws an error
    expect(processPractitionerMappingEntries).not.toHaveBeenCalled();
    expect(processOtherEntries).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalled();
  });

  it('should log an error, throw an exception, and halt further execution when processPractitionerMappingEntries fails', async () => {
    (processPractitionerMappingEntries as jest.Mock).mockRejectedValueOnce(
      new Error(),
    );

    await expect(
      processStreamRecordsInteractor(applicationContext, {
        recordsToProcess: [],
      }),
    ).rejects.toThrow();

    expect(processRemoveEntries).toHaveBeenCalled();
    expect(processPractitionerMappingEntries).toHaveBeenCalled(); // the one that throws an error
    expect(processOtherEntries).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalled();
  });

  it('should log an error, throw an exception, and halt further execution when processOtherEntries fails', async () => {
    (processOtherEntries as jest.Mock).mockRejectedValueOnce(new Error());

    await expect(
      processStreamRecordsInteractor(applicationContext, {
        recordsToProcess: [],
      }),
    ).rejects.toThrow();

    expect(processRemoveEntries).toHaveBeenCalled();
    expect(processPractitionerMappingEntries).toHaveBeenCalled();
    expect(processOtherEntries).toHaveBeenCalled(); // the one that throws an error
    expect(errorSpy).toHaveBeenCalled();
  });
});
