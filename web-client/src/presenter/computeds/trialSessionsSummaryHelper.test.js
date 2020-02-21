import { User } from '../../../../shared/src/business/entities/User';
import { runCompute } from 'cerebral/test';
import { trialSessionsSummaryHelper as trialSessionsSummaryHelperComputed } from './trialSessionsSummaryHelper';
import { withAppContextDecorator } from '../../withAppContext';

let currentUser;

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
      userId: '777',
    };
  });

  it('should return the judeUserId as the logged in user when that user is a judge', () => {
    const result = runCompute(trialSessionsSummaryHelper, {
      state: {},
    });

    expect(result.judgeUserId).toEqual('777');
  });

  it('should return the judeUserId as the chambers judge associated with the logged in user', () => {
    currentUser = {
      role: User.ROLES.chambers,
      userId: '444',
    };

    const result = runCompute(trialSessionsSummaryHelper, {
      state: {
        judgeUser: {
          role: User.ROLES.judge,
          userId: '777',
        },
      },
    });

    expect(result.judgeUserId).toEqual('777');
  });
});
