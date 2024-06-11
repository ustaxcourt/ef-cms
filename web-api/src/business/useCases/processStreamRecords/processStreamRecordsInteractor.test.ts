jest.mock('./processStreamUtilities');
jest.mock('./processDocketEntries');
jest.mock('./processMessageEntries');
jest.mock('./processPractitionerMappingEntries');
jest.mock('./processRemoveEntries');
jest.mock('./processWorkItemEntries');
jest.mock('./processCaseEntries');
jest.mock('./processOtherEntries');
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { partitionRecords } from './processStreamUtilities';
import { processCaseEntries } from './processCaseEntries';
import { processDocketEntries } from './processDocketEntries';
import { processMessageEntries } from './processMessageEntries';
import { processOtherEntries } from './processOtherEntries';
import { processPractitionerMappingEntries } from './processPractitionerMappingEntries';
import { processRemoveEntries } from './processRemoveEntries';
import { processStreamRecordsInteractor } from './processStreamRecordsInteractor';
import { processWorkItemEntries } from './processWorkItemEntries';

describe('processStreamRecordsInteractor', () => {
  beforeAll(() => {
    (processRemoveEntries as jest.Mock).mockResolvedValue([]);
    (processCaseEntries as jest.Mock).mockResolvedValue([]);
    (processDocketEntries as jest.Mock).mockResolvedValue([]);
    (processWorkItemEntries as jest.Mock).mockResolvedValue([]);
    (processMessageEntries as jest.Mock).mockResolvedValue([]);
    (processPractitionerMappingEntries as jest.Mock).mockResolvedValue([]);
    (processOtherEntries as jest.Mock).mockResolvedValue([]);

    (partitionRecords as jest.Mock).mockReturnValue({
      caseEntityRecords: [],
      docketEntryRecords: [],
      irsPractitionerMappingRecords: [],
      otherRecords: [],
      privatePractitionerMappingRecords: [],
      removeRecords: [],
      workItemRecords: [],
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
    expect(processCaseEntries).not.toHaveBeenCalled();
    expect(processDocketEntries).not.toHaveBeenCalled();
    expect(processWorkItemEntries).not.toHaveBeenCalled();
    expect(processMessageEntries).not.toHaveBeenCalled();
    expect(processPractitionerMappingEntries).not.toHaveBeenCalled();
    expect(processOtherEntries).not.toHaveBeenCalled();
    expect(applicationContext.logger.error).toHaveBeenCalledTimes(2);
  });

  it('should log an error, throw an exception, and halt further execution when processCaseEntries fails', async () => {
    (processCaseEntries as jest.Mock).mockRejectedValueOnce(new Error());

    await expect(
      processStreamRecordsInteractor(applicationContext, {
        recordsToProcess: [],
      }),
    ).rejects.toThrow();

    expect(processRemoveEntries).toHaveBeenCalled();
    expect(processCaseEntries).toHaveBeenCalled(); // the one that throws an error
    expect(processDocketEntries).not.toHaveBeenCalled();
    expect(processWorkItemEntries).not.toHaveBeenCalled();
    expect(processMessageEntries).not.toHaveBeenCalled();
    expect(processPractitionerMappingEntries).not.toHaveBeenCalled();
    expect(processOtherEntries).not.toHaveBeenCalled();
    expect(applicationContext.logger.error).toHaveBeenCalledTimes(2);
  });

  it('should log an error, throw an exception, and halt further execution when processDocketEntries fails', async () => {
    (processDocketEntries as jest.Mock).mockRejectedValueOnce(new Error());

    await expect(
      processStreamRecordsInteractor(applicationContext, {
        recordsToProcess: [],
      }),
    ).rejects.toThrow();

    expect(processRemoveEntries).toHaveBeenCalled();
    expect(processCaseEntries).toHaveBeenCalled();
    expect(processDocketEntries).toHaveBeenCalled(); // the one that throws an error
    expect(processWorkItemEntries).not.toHaveBeenCalled();
    expect(processMessageEntries).not.toHaveBeenCalled();
    expect(processPractitionerMappingEntries).not.toHaveBeenCalled();
    expect(processOtherEntries).not.toHaveBeenCalled();
    expect(applicationContext.logger.error).toHaveBeenCalledTimes(2);
  });

  it('should log an error, throw an exception, and halt further execution when processWorkItemEntries fails', async () => {
    (processWorkItemEntries as jest.Mock).mockRejectedValueOnce(new Error());

    await expect(
      processStreamRecordsInteractor(applicationContext, {
        recordsToProcess: [],
      }),
    ).rejects.toThrow();

    expect(processRemoveEntries).toHaveBeenCalled();
    expect(processCaseEntries).toHaveBeenCalled();
    expect(processDocketEntries).toHaveBeenCalled();
    expect(processWorkItemEntries).toHaveBeenCalled(); // the one that throws an error
    expect(processMessageEntries).not.toHaveBeenCalled();
    expect(processPractitionerMappingEntries).not.toHaveBeenCalled();
    expect(processOtherEntries).not.toHaveBeenCalled();
    expect(applicationContext.logger.error).toHaveBeenCalledTimes(2);
  });

  it('should log an error, throw an exception, and halt further execution when processMessageEntries fails', async () => {
    (processMessageEntries as jest.Mock).mockRejectedValueOnce(new Error());

    await expect(
      processStreamRecordsInteractor(applicationContext, {
        recordsToProcess: [],
      }),
    ).rejects.toThrow();

    expect(processRemoveEntries).toHaveBeenCalled();
    expect(processCaseEntries).toHaveBeenCalled();
    expect(processDocketEntries).toHaveBeenCalled();
    expect(processWorkItemEntries).toHaveBeenCalled();
    expect(processMessageEntries).toHaveBeenCalled(); // the one that throws an error
    expect(processPractitionerMappingEntries).not.toHaveBeenCalled();
    expect(processOtherEntries).not.toHaveBeenCalled();
    expect(applicationContext.logger.error).toHaveBeenCalledTimes(2);
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
    expect(processCaseEntries).toHaveBeenCalled();
    expect(processDocketEntries).toHaveBeenCalled();
    expect(processWorkItemEntries).toHaveBeenCalled();
    expect(processMessageEntries).toHaveBeenCalled();
    expect(processPractitionerMappingEntries).toHaveBeenCalled(); // the one that throws an error
    expect(processOtherEntries).not.toHaveBeenCalled();
    expect(applicationContext.logger.error).toHaveBeenCalledTimes(2);
  });

  it('should log an error, throw an exception, and halt further execution when processOtherEntries fails', async () => {
    (processOtherEntries as jest.Mock).mockRejectedValueOnce(new Error());

    await expect(
      processStreamRecordsInteractor(applicationContext, {
        recordsToProcess: [],
      }),
    ).rejects.toThrow();

    expect(processRemoveEntries).toHaveBeenCalled();
    expect(processCaseEntries).toHaveBeenCalled();
    expect(processDocketEntries).toHaveBeenCalled();
    expect(processWorkItemEntries).toHaveBeenCalled();
    expect(processMessageEntries).toHaveBeenCalled();
    expect(processPractitionerMappingEntries).toHaveBeenCalled();
    expect(processOtherEntries).toHaveBeenCalled(); // the one that throws an error
    expect(applicationContext.logger.error).toHaveBeenCalledTimes(2);
  });
});
