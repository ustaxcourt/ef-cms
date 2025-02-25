import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { batchGet } from '../../dynamodbClientService';
import { getBulkTrialSessionWorkingCopies } from './getBulkTrialSessionWorkingCopies';

jest.mock('../../dynamodbClientService');

const batchGetMock = batchGet as jest.Mock;

batchGetMock.mockReturnValue([
  {
    caseMetadata: {},
    entityName: 'TrialSessionWorkingCopy',
    filters: {
      basisReached: true,
      continued: true,
      definiteTrial: true,
      dismissed: true,
      motionToDismiss: true,
      probableSettlement: true,
      probableTrial: true,
      recall: true,
      rule122: true,
      setForTrial: true,
      settled: true,
      showAll: true,
      statusUnassigned: true,
      submittedCAV: true,
    },
    pk: 'trial-session-working-copy|111ac21b-99f9-4321-98c8-b95db00af96b',
    sessionNotes: 'Judge Colvin Super notes!',
    sk: 'user|dabbad00-18d0-43ec-bafb-654e83405416',
    sort: 'docket',
    sortOrder: 'asc',
    trialSessionId: '111ac21b-99f9-4321-98c8-b95db00af96b',
    userId: 'dabbad00-18d0-43ec-bafb-654e83405416',
  },
  {
    caseMetadata: {},
    entityName: 'TrialSessionWorkingCopy',
    filters: {
      basisReached: true,
      continued: true,
      definiteTrial: true,
      dismissed: true,
      motionToDismiss: true,
      probableSettlement: true,
      probableTrial: true,
      recall: true,
      rule122: true,
      setForTrial: true,
      settled: true,
      showAll: true,
      statusUnassigned: true,
      submittedCAV: true,
    },
    pk: 'trial-session-working-copy|0d943468-bc2e-4631-84e3-b084cf5b1fbb',
    sessionNotes: 'Cohen Cohen Cohen Notes',
    sk: 'user|dabbad04-18d0-43ec-bafb-654e83405416',
    sort: 'docket',
    sortOrder: 'asc',
    trialSessionId: '0d943468-bc2e-4631-84e3-b084cf5b1fbb',
    userId: 'dabbad04-18d0-43ec-bafb-654e83405416',
  },
]);

describe('getBulkTrialSessionWorkingCopies', () => {
  it('should get the trial session notes by special session array', async () => {
    const specialTrialSessions = [
      { pk: '123', sk: '456' },
      { pk: '456', sk: '789' },
    ];

    const result = await getBulkTrialSessionWorkingCopies({
      applicationContext,
      specialTrialSessions,
    });
    expect(result).toEqual([
      {
        sessionNotes: 'Judge Colvin Super notes!',
        trialSessionId: '111ac21b-99f9-4321-98c8-b95db00af96b',
      },
      {
        sessionNotes: 'Cohen Cohen Cohen Notes',
        trialSessionId: '0d943468-bc2e-4631-84e3-b084cf5b1fbb',
      },
    ]);
    expect(batchGetMock).toHaveBeenCalledWith({
      applicationContext,
      keys: specialTrialSessions,
    });
  });
});
