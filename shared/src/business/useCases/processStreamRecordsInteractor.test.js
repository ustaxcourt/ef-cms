jest.mock('./processStreamUtilities');
const {
  filterRecords,
  partitionRecords,
  processCaseEntries,
  processDocketEntries,
  processOtherEntries,
  processRemoveEntries,
  processWorkItemEntries,
} = require('./processStreamUtilities');
const {
  processStreamRecordsInteractor,
} = require('./processStreamRecordsInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');

describe('processStreamRecordsInteractor', () => {
  beforeAll(() => {
    // mocked in the order they are called.
    processRemoveEntries.mockResolvedValue([]);
    processCaseEntries.mockResolvedValue([]);
    processDocketEntries.mockResolvedValue([]);
    processWorkItemEntries.mockResolvedValue([]);
    processOtherEntries.mockResolvedValue([]);

    filterRecords.mockReturnValue(true);
    partitionRecords.mockReturnValue({
      caseEntityRecords: [],
      docketEntryRecords: [],
      otherRecords: [],
      removeRecords: [],
      workItemRecords: [],
    });
  });

  it('sanity check', async () => {
    await processStreamRecordsInteractor(applicationContext, {
      recordsToProcess: [{ my: 'record' }],
    });

    expect(filterRecords).toHaveBeenCalled();
    expect(partitionRecords).toHaveBeenCalled();

    expect(processRemoveEntries).toHaveBeenCalled();
    expect(processCaseEntries).toHaveBeenCalled();
    expect(processDocketEntries).toHaveBeenCalled();
    expect(processWorkItemEntries).toHaveBeenCalled();
    expect(processOtherEntries).toHaveBeenCalled();

    expect(applicationContext.logger.error).not.toHaveBeenCalled();
  });

  describe('calls each of the "process" functions, and fails fast if one of them throws an error.', () => {
    it('logs an error, throws an exception, and halts further execution if processRemoveEntries fails', async () => {
      processRemoveEntries.mockRejectedValueOnce(new Error('something bad'));

      await expect(
        processStreamRecordsInteractor(applicationContext, {
          recordsToProcess: [{ my: 'record' }],
        }),
      ).rejects.toThrow();

      expect(processRemoveEntries).toHaveBeenCalled(); // the one that throws an error
      expect(processCaseEntries).not.toHaveBeenCalled();
      expect(processDocketEntries).not.toHaveBeenCalled();
      expect(processWorkItemEntries).not.toHaveBeenCalled();
      expect(processOtherEntries).not.toHaveBeenCalled();

      expect(applicationContext.logger.error).toHaveBeenCalledTimes(2);
    });

    it('logs an error, throws an exception, and halts further execution if processCaseEntries fails', async () => {
      processCaseEntries.mockRejectedValueOnce(new Error('something bad'));

      await expect(
        processStreamRecordsInteractor(applicationContext, {
          recordsToProcess: [{ my: 'record' }],
        }),
      ).rejects.toThrow();

      expect(processRemoveEntries).toHaveBeenCalled();
      expect(processCaseEntries).toHaveBeenCalled(); // the one that throws an error
      expect(processDocketEntries).not.toHaveBeenCalled();
      expect(processWorkItemEntries).not.toHaveBeenCalled();
      expect(processOtherEntries).not.toHaveBeenCalled();

      expect(applicationContext.logger.error).toHaveBeenCalledTimes(2);
    });
    it('logs an error, throws an exception, and halts further execution if processDocketEntries fails', async () => {
      processDocketEntries.mockRejectedValueOnce(new Error('something bad'));

      await expect(
        processStreamRecordsInteractor(applicationContext, {
          recordsToProcess: [{ my: 'record' }],
        }),
      ).rejects.toThrow();

      expect(processRemoveEntries).toHaveBeenCalled();
      expect(processCaseEntries).toHaveBeenCalled();
      expect(processDocketEntries).toHaveBeenCalled(); // the one that throws an error
      expect(processWorkItemEntries).not.toHaveBeenCalled();
      expect(processOtherEntries).not.toHaveBeenCalled();

      expect(applicationContext.logger.error).toHaveBeenCalledTimes(2);
    });
    it('logs an error, throws an exception, and halts further execution if processWorkItemEntries fails', async () => {
      processWorkItemEntries.mockRejectedValueOnce(new Error('something bad'));

      await expect(
        processStreamRecordsInteractor(applicationContext, {
          recordsToProcess: [{ my: 'record' }],
        }),
      ).rejects.toThrow();

      expect(processRemoveEntries).toHaveBeenCalled();
      expect(processCaseEntries).toHaveBeenCalled();
      expect(processDocketEntries).toHaveBeenCalled();
      expect(processWorkItemEntries).toHaveBeenCalled(); // the one that throws an error
      expect(processOtherEntries).not.toHaveBeenCalled();

      expect(applicationContext.logger.error).toHaveBeenCalledTimes(2);
    });
    it('logs an error, throws an exception, and halts further execution if processOtherEntries fails', async () => {
      processOtherEntries.mockRejectedValueOnce(new Error('something bad'));

      await expect(
        processStreamRecordsInteractor(applicationContext, {
          recordsToProcess: [{ my: 'record' }],
        }),
      ).rejects.toThrow();

      expect(processRemoveEntries).toHaveBeenCalled();
      expect(processCaseEntries).toHaveBeenCalled();
      expect(processDocketEntries).toHaveBeenCalled();
      expect(processWorkItemEntries).toHaveBeenCalled();
      expect(processOtherEntries).toHaveBeenCalled(); // the one that throws an error

      expect(applicationContext.logger.error).toHaveBeenCalledTimes(2);
    });
  });
});
