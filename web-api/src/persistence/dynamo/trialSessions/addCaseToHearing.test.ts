import { addCaseToHearing } from './addCaseToHearing';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { updateTrialSession } from './updateTrialSession';

jest.mock('./updateTrialSession');

const mockTrialSession = {
  trialSessionId: '123',
};

describe('addCaseToHearing', () => {
  it('adds a mapping record for the case / hearing', async () => {
    await addCaseToHearing({
      applicationContext,
      docketNumber: '123-20',
      trialSession: mockTrialSession as any,
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        pk: 'case|123-20',
        sk: 'hearing|123',
        trialSessionId: '123',
      },
    });
  });

  it('attempts to persist the trial session', async () => {
    await addCaseToHearing({
      applicationContext,
      docketNumber: '123-20',
      trialSession: mockTrialSession as any,
    });

    expect((updateTrialSession as jest.Mock).mock.calls[0][0]).toMatchObject({
      applicationContext,
      trialSessionToUpdate: mockTrialSession,
    });
  });
});
