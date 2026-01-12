import '@web-api/persistence/postgres/trialSessions/mocks.jest';
import { RawTrialSessionWorkingCopy } from '@shared/business/entities/trialSessions/TrialSessionWorkingCopy';
import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { mockJudgeUser } from '@shared/test/mockAuthUsers';
import { omit } from 'lodash';
import { updateTrialSessionWorkingCopyInteractor } from './updateTrialSessionWorkingCopyInteractor';
import { getTrialSessionWorkingCopies as getTrialSessionWorkingCopiesMock } from '@web-api/persistence/postgres/trialSessions/getTrialSessionWorkingCopies';

let user;

const MOCK_WORKING_COPY: RawTrialSessionWorkingCopy = {
  caseMetadata: {
    '101-19': { trialStatus: 'dismissed' },
  },
  sort: 'practitioner',
  sortOrder: 'desc',
  trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
  filters: {
    basisReached: false,
    continued: false,
    definiteTrial: false,
    dismissed: false,
    motionToDismiss: false,
    probableSettlement: false,
    probableTrial: false,
    recall: false,
    rule122: false,
    setForTrial: false,
    settled: false,
    showAll: false,
    statusUnassigned: false,
    submittedCAV: false,
  },
};

const trialSessionWorkingCopy: RawTrialSessionWorkingCopy = MOCK_WORKING_COPY;

describe('Update trial session working copy', () => {
  const getTrialSessionWorkingCopies = jest.mocked(
    getTrialSessionWorkingCopiesMock,
  );
  beforeEach(() => {
    applicationContext.environment.stage = 'local';
    getTrialSessionWorkingCopies.mockResolvedValue([MOCK_WORKING_COPY]);
  });

  it('throws error if user is unauthorized', async () => {
    user = {
      role: 'unauthorizedRole',
      userId: 'unauthorizedUser',
    };

    await expect(
      updateTrialSessionWorkingCopyInteractor(
        {
          trialSessionWorkingCopyToUpdate: trialSessionWorkingCopy,
        },
        user,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('throws an error if the entity returned from persistence is invalid', async () => {
    getTrialSessionWorkingCopies.mockResolvedValue(
      // @ts-expect-error - Intentionally testing with incomplete mock data missing userId field
      [omit(MOCK_WORKING_COPY, 'userId')],
    );

    await expect(
      updateTrialSessionWorkingCopyInteractor(
        {
          trialSessionWorkingCopyToUpdate: trialSessionWorkingCopy,
        },
        mockJudgeUser,
      ),
    ).rejects.toThrow('The TrialSessionWorkingCopy entity was invalid');
  });

  it('correctly returns data from persistence', async () => {
    const result = await updateTrialSessionWorkingCopyInteractor(
      {
        trialSessionWorkingCopyToUpdate: trialSessionWorkingCopy,
      },
      mockJudgeUser,
    );
    expect(result).toMatchObject(MOCK_WORKING_COPY);
  });
});
