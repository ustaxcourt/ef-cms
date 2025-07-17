jest.mock('./processStreamUtilities');
jest.mock(
  '@web-api/business/useCases/processStreamRecords/processCompletionMarkers',
);
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';
import { processStreamRecordsInteractor } from './processStreamRecordsInteractor';
import { processCompletionMarkers as processCompletionMarkersMock } from '@web-api/business/useCases/processStreamRecords/processCompletionMarkers';

const logger = getDawsonLogger();
const errorSpy = jest.spyOn(logger, 'error');

describe('processStreamRecordsInteractor', () => {
  const processCompletionMarkers = jest.mocked(processCompletionMarkersMock);
  it('should successfully filter and process completion markers', async () => {
    await processStreamRecordsInteractor(applicationContext, {
      recordsToProcess: [
        { dynamodb: { NewImage: { entityName: { S: 'CompletionMarker' } } } },
        { dynamodb: { NewImage: { entityName: { S: 'SomethingElse' } } } },
      ],
    });

    expect(processCompletionMarkers).toHaveBeenCalledWith({
      applicationContext,
      completionMarkers: [
        { dynamodb: { NewImage: { entityName: { S: 'CompletionMarker' } } } },
      ],
    });
  });

  it('should log an error when a dependency fails', async () => {
    const theError = new Error('Uh oh');
    processCompletionMarkers.mockRejectedValue(theError);

    await expect(
      processStreamRecordsInteractor(applicationContext, {
        recordsToProcess: [
          { dynamodb: { NewImage: { entityName: { S: 'CompletionMarker' } } } },
          { dynamodb: { NewImage: { entityName: { S: 'SomethingElse' } } } },
        ],
      }),
    ).rejects.toThrow(theError);
    expect(errorSpy).toHaveBeenCalled();
  });
});
