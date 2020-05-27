import { User } from '../../../../shared/src/business/entities/User';
import { runCompute } from 'cerebral/test';
import { trialSessionsSummaryHelper as trialSessionsSummaryHelperComputed } from './trialSessionsSummaryHelper';
import { withAppContextDecorator } from '../../withAppContext';

let currentUser;

const judgeId = '733777c2-cb31-44c6-afce-f7bc1a3f613b';
const chambersId = 'a5ac202c-4e96-46f2-8968-2749ea845143';

const trialSessionsSummaryHelper = withAppContextDecorator(
  trialSessionsSummaryHelperComputed,
  {
    getConstants: () => ({
      USER_ROLES: User.ROLES,
    }),
    getCurrentUser: () => currentUser,
  },
);

describe('trialSessionsSummaryHelper', () => {
  beforeEach(() => {
    currentUser = {
      role: User.ROLES.judge,
      userId: judgeId,
    };
  });

  it('should return the judeUserId as the logged in user when that user is a judge', () => {
    const result = runCompute(trialSessionsSummaryHelper, {
      state: {},
    });

    expect(result.judgeUserId).toEqual(judgeId);
  });

  it('should return the judeUserId as the chambers judge associated with the logged in user', () => {
    currentUser = {
      role: User.ROLES.chambers,
      userId: chambersId,
    };

    const result = runCompute(trialSessionsSummaryHelper, {
      state: {
        judgeUser: {
          role: User.ROLES.judge,
          userId: judgeId,
        },
      },
    });

    expect(result.judgeUserId).toEqual(judgeId);
  });
});
