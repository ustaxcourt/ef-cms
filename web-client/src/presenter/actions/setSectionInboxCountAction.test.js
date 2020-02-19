import { User } from '../../../../shared/src/business/entities/User';
import { applicationContext } from '../../applicationContext';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { setSectionInboxCountAction } from './setSectionInboxCountAction';

describe('setSectionInboxCountAction', () => {
  let currentUser;
  let workItems;
  presenter.providers.applicationContext = applicationContext;

  beforeEach(() => {
    presenter.providers.applicationContext.getCurrentUser = () => currentUser;
    workItems = [
      {
        associatedJudge: 'Judge Barker',
        document: {
          isFileAttached: true,
        },
        isQC: false,
      },
      {
        associatedJudge: 'Judge Carey',
        document: {
          isFileAttached: true,
        },
        isQC: false,
      },
      {
        associatedJudge: 'Chief Judge',
        document: {
          isFileAttached: true,
        },
        isQC: false,
      },
      {
        associatedJudge: 'Judge Barker',
        document: {
          isFileAttached: true,
        },
        isQC: true,
      },
      {
        associatedJudge: 'Judge Barker',
        document: {
          isFileAttached: false,
        },
        isQC: false,
      },
    ];
  });

  it('sets sectionInboxCount for a docketClerk user', async () => {
    currentUser = {
      role: User.ROLES.docketClerk,
    };

    const result = await runAction(setSectionInboxCountAction, {
      modules: {
        presenter,
      },
      props: {
        workItems,
      },
      state: {
        judgeUser: undefined,
        workQueueToDisplay: {
          workQueueIsInternal: true,
        },
      },
    });
    expect(result.state.sectionInboxCount).toEqual(3);
  });

  it('sets sectionInboxCount for a judge user', async () => {
    currentUser = {
      name: 'Judge Barker',
      role: User.ROLES.judge,
    };

    const result = await runAction(setSectionInboxCountAction, {
      modules: {
        presenter,
      },
      props: {
        workItems,
      },
      state: {
        judgeUser: {
          name: 'Judge Barker',
        },
        workQueueToDisplay: {
          workQueueIsInternal: true,
        },
      },
    });
    expect(result.state.sectionInboxCount).toEqual(1);
  });

  it('sets sectionInboxCount for a chambers user', async () => {
    currentUser = {
      name: 'ADC',
      role: User.ROLES.adc,
    };

    const result = await runAction(setSectionInboxCountAction, {
      modules: {
        presenter,
      },
      props: {
        workItems,
      },
      state: {
        workQueueToDisplay: {
          workQueueIsInternal: true,
        },
      },
    });
    expect(result.state.sectionInboxCount).toEqual(1);
  });
});
