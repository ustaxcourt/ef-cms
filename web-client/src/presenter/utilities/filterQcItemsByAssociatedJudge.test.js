import { Case } from '../../../../shared/src/business/entities/cases/Case';
import { User } from '../../../../shared/src/business/entities/User';
import { filterQcItemsByAssociatedJudge } from './filterQcItemsByAssociatedJudge';

let applicationContext;
let currentUser;
let itemsToFilter;
let judgeUser;

describe('filterQcItemsByAssociatedJudge', () => {
  beforeEach(() => {
    applicationContext = {
      getConstants: () => ({
        CHIEF_JUDGE: Case.CHIEF_JUDGE,
        USER_ROLES: User.ROLES,
      }),
      getCurrentUser: () => currentUser,
    };

    itemsToFilter = [
      {
        id: 1,
      },
      {
        associatedJudge: 'Judge One',
        id: 2,
      },
      {
        associatedJudge: 'Judge Two',
        id: 3,
      },
      {
        associatedJudge: 'Chief Judge',
        id: 4,
      },
    ];

    judgeUser = null;
  });

  it('returns a pass-through filter if the user is not of the judge, chambers, or adc roles', () => {
    currentUser = {
      role: User.ROLES.docketClerk,
    };

    const filterFunction = filterQcItemsByAssociatedJudge({
      applicationContext,
      judgeUser,
    });

    const filteredItems = itemsToFilter.filter(filterFunction);

    expect(filterFunction()).toEqual(true);
    expect(filteredItems.length).toEqual(itemsToFilter.length);
  });

  it('returns a filter for the current judge or chambers user', () => {
    currentUser = {
      role: User.ROLES.chambers,
    };

    judgeUser = {
      name: 'Judge One',
    };

    const filterFunction = filterQcItemsByAssociatedJudge({
      applicationContext,
      judgeUser,
    });

    const filteredItems = itemsToFilter.filter(filterFunction);
    expect(filteredItems.length).toEqual(1);
    expect(filteredItems[0].id).toEqual(2);
  });

  it('returns a filter for the current adc user', () => {
    currentUser = {
      role: User.ROLES.adc,
    };

    const filterFunction = filterQcItemsByAssociatedJudge({
      applicationContext,
      judgeUser,
    });

    const filteredItems = itemsToFilter.filter(filterFunction);
    expect(filteredItems.length).toEqual(2);
    expect(filteredItems[0].id).toEqual(1);
    expect(filteredItems[1].id).toEqual(4);
  });
});
