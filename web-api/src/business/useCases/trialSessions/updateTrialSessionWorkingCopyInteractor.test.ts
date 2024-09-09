import { RawTrialSessionWorkingCopy } from '@shared/business/entities/trialSessions/TrialSessionWorkingCopy';
import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { mockJudgeUser } from '@shared/test/mockAuthUsers';
import { omit } from 'lodash';
import { updateTrialSessionWorkingCopyInteractor } from './updateTrialSessionWorkingCopyInteractor';

let user;

const MOCK_WORKING_COPY = {
  caseMetadata: {
    '101-19': { trialStatus: 'dismissed' },
  },
  sort: 'practitioner',
  sortOrder: 'desc',
  trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
};

describe('Update trial session working copy', () => {
  beforeEach(() => {
    applicationContext.environment.stage = 'local';
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionWorkingCopy.mockReturnValue(MOCK_WORKING_COPY);
  });

  it('throws error if user is unauthorized', async () => {
    user = {
      role: 'unauthorizedRole',
      userId: 'unauthorizedUser',
    };

    applicationContext
      .getPersistenceGateway()
      .updateTrialSessionWorkingCopy.mockReturnValue({});

    await expect(
      updateTrialSessionWorkingCopyInteractor(
        applicationContext,
        {
          trialSessionWorkingCopyToUpdate:
            MOCK_WORKING_COPY as unknown as RawTrialSessionWorkingCopy,
        },
        user,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('throws an error if the entity returned from persistence is invalid', async () => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionWorkingCopy.mockResolvedValue(
        omit(MOCK_WORKING_COPY, 'userId'),
      );

    await expect(
      updateTrialSessionWorkingCopyInteractor(
        applicationContext,
        {
          trialSessionWorkingCopyToUpdate:
            MOCK_WORKING_COPY as unknown as RawTrialSessionWorkingCopy,
        },
        mockJudgeUser,
      ),
    ).rejects.toThrow('The TrialSessionWorkingCopy entity was invalid');
  });

  it('correctly returns data from persistence', async () => {
    applicationContext
      .getPersistenceGateway()
      .updateTrialSessionWorkingCopy.mockResolvedValue(MOCK_WORKING_COPY);

    const result = await updateTrialSessionWorkingCopyInteractor(
      applicationContext,
      {
        trialSessionWorkingCopyToUpdate:
          MOCK_WORKING_COPY as unknown as RawTrialSessionWorkingCopy,
      },
      mockJudgeUser,
    );
    expect(result).toMatchObject(MOCK_WORKING_COPY);
  });
});
