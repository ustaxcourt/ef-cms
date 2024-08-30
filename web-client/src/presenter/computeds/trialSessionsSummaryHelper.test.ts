import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { colvinsChambersUser, judgeUser } from '@shared/test/mockUsers';
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
        user: judgeUser,
      },
    });

    expect(result.judgeUserId).toEqual(judgeUser.userId);
  });

  it('should return the judeUserId as the chambers judge associated with the logged in user', () => {
    const result = runCompute(trialSessionsSummaryHelper, {
      state: {
        judgeUser: {
          role: ROLES.judge,
          userId: judgeUser.userId,
        },
        user: colvinsChambersUser,
      },
    });

    expect(result.judgeUserId).toEqual(judgeUser.userId);
  });
});
