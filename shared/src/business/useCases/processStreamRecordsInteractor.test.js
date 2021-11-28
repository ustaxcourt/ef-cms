jest.mock('./elasticsearch/processStreamUtilities');
jest.mock('./elasticsearch/processDocketEntries');
jest.mock('./elasticsearch/processMessageEntries');
jest.mock('./elasticsearch/processPractitionerMappingEntries');
jest.mock('./elasticsearch/processRemoveEntries');
jest.mock('./elasticsearch/processWorkItemEntries');
jest.mock('./elasticsearch/processCaseEntries');
jest.mock('./elasticsearch/processOtherEntries');
const {
  processDocketEntries,
} = require('./elasticsearch/processDocketEntries');
const {
  processMessageEntries,
} = require('./elasticsearch/processMessageEntries');
const {
  processPractitionerMappingEntries,
} = require('./elasticsearch/processPractitionerMappingEntries');
const {
  processRemoveEntries,
} = require('./elasticsearch/processRemoveEntries');
const {
  processStreamRecordsInteractor,
} = require('./processStreamRecordsInteractor');
const {
  processWorkItemEntries,
} = require('./elasticsearch/processWorkItemEntries');
const { applicationContext } = require('../test/createTestApplicationContext');
const { partitionRecords } = require('./elasticsearch/processStreamUtilities');
const { processCaseEntries } = require('./elasticsearch/processCaseEntries');
const { processOtherEntries } = require('./elasticsearch/processOtherEntries');

describe('processStreamRecordsInteractor', () => {
  beforeAll(() => {
    processRemoveEntries.mockResolvedValue([]);
    processCaseEntries.mockResolvedValue([]);
    processDocketEntries.mockResolvedValue([]);
    processWorkItemEntries.mockResolvedValue([]);
    processMessageEntries.mockResolvedValue([]);
    processPractitionerMappingEntries.mockResolvedValue([]);
    processOtherEntries.mockResolvedValue([]);

    partitionRecords.mockReturnValue({
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
    processRemoveEntries.mockRejectedValueOnce(new Error());

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
    processCaseEntries.mockRejectedValueOnce(new Error());

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
    processDocketEntries.mockRejectedValueOnce(new Error());

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
    processWorkItemEntries.mockRejectedValueOnce(new Error());

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
    processMessageEntries.mockRejectedValueOnce(new Error());

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
    processPractitionerMappingEntries.mockRejectedValueOnce(new Error());

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
    processOtherEntries.mockRejectedValueOnce(new Error());

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
