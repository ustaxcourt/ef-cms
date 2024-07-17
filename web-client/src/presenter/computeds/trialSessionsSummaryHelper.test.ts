import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { mockChambersUser, mockJudgeUser } from '@shared/test/mockAuthUsers';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { trialSessionsSummaryHelper as trialSessionsSummaryHelperComputed } from './trialSessionsSummaryHelper';
import { withAppContextDecorator } from '../../withAppContext';

const trialSessionsSummaryHelper = withAppContextDecorator(
  trialSessionsSummaryHelperComputed,
  {
    getConstants: () => ({
      USER_ROLES: ROLES,
    }),
  },
);

describe('trialSessionsSummaryHelper', () => {
  it('should return the judeUserId as the logged in user when that user is a judge', () => {
    const result = runCompute(trialSessionsSummaryHelper, {
      state: {
        user: mockJudgeUser,
      },
    });

    expect(result.judgeUserId).toEqual(mockJudgeUser.userId);
  });

  it('should return the judeUserId as the chambers judge associated with the logged in user', () => {
    const result = runCompute(trialSessionsSummaryHelper, {
      state: {
        judgeUser: {
          role: ROLES.judge,
          userId: mockJudgeUser.userId,
        },
        user: mockChambersUser,
      },
    });

    expect(result.judgeUserId).toEqual(mockJudgeUser.userId);
  });
});
