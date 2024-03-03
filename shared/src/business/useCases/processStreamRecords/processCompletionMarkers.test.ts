import * as circleCiHelper from '../../../../admin-tools/circleci/circleci-helper';
import { applicationContext } from '../../test/createTestApplicationContext';
import { cloneDeep } from 'lodash';
import { processCompletionMarkers } from './processCompletionMarkers';
import type { DynamoDBRecord } from 'aws-lambda';

jest.mock('../../../../admin-tools/circleci/circleci-helper');
const approvePendingJob = jest.spyOn(circleCiHelper, 'approvePendingJob');

describe('processCompletionMarker', () => {
  const mockCompletionMarker: DynamoDBRecord = {
    dynamodb: {
      NewImage: {
        apiToken: {
          S: 'openSesame',
        },
        completedAt: {
          S: '2020-01-01T05:00:00Z',
        },
        entityName: {
          S: 'CompletionMarker',
        },
        environment: {
          S: 'jest',
        },
        jobName: {
          S: 'wait-for-reindex',
        },
        pk: {
          S: 'completion-marker|b94dc3c3-e5aB-42cf-8a93-66dc8f3a6268',
        },
        sk: {
          S: 'completion-marker|b94dc3c3-e5aB-42cf-8a93-66dc8f3a6268',
        },
        workflowId: {
          S: 'b94dc3c3-e5aB-42cf-8a93-66dc8f3a6268',
        },
      },
    },
  };

  beforeEach(() => {
    process.env.STAGE = 'jest';
  });

  it('returns immediately if the completion markers array is empty', async () => {
    await processCompletionMarkers({
      applicationContext,
      completionMarkers: [],
    });
    expect(applicationContext.logger.debug).not.toHaveBeenCalled();
  });

  it.each(['apiToken', 'environment', 'jobName', 'workflowId'])(
    'does not proceed if %s is undefined',
    async key => {
      const invalidCompletionMarker = cloneDeep(mockCompletionMarker);
      if (
        invalidCompletionMarker.dynamodb &&
        invalidCompletionMarker.dynamodb.NewImage &&
        invalidCompletionMarker.dynamodb.NewImage[key]
      ) {
        invalidCompletionMarker.dynamodb.NewImage[key].S = undefined;
      }
      await processCompletionMarkers({
        applicationContext,
        completionMarkers: [invalidCompletionMarker],
      });
      expect(approvePendingJob).not.toHaveBeenCalled();
    },
  );

  it("does not proceed if the completion marker's environment does not match this one", async () => {
    process.env.STAGE = 'not-jest';
    await processCompletionMarkers({
      applicationContext,
      completionMarkers: [mockCompletionMarker],
    });
    expect(approvePendingJob).not.toHaveBeenCalled();
  });

  it("approves the deployment's pending wait step", async () => {
    await processCompletionMarkers({
      applicationContext,
      completionMarkers: [mockCompletionMarker],
    });
    expect(approvePendingJob).toHaveBeenCalledWith({
      apiToken: 'openSesame',
      jobName: 'wait-for-reindex',
      workflowId: 'b94dc3c3-e5aB-42cf-8a93-66dc8f3a6268',
    });
  });
});
