import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setSectionInboxCountAction } from './setSectionInboxCountAction';

describe('setSectionInboxCountAction', () => {
  const { CHIEF_JUDGE, USER_ROLES } = applicationContext.getConstants();

  let workItems;

  beforeAll(() => {
    workItems = [
      {
        associatedJudge: 'Judge Barker',
        document: {
          isFileAttached: true,
        },
      },
      {
        associatedJudge: 'Judge Carey',
        document: {
          isFileAttached: true,
        },
      },
      {
        associatedJudge: CHIEF_JUDGE,
        document: {
          isFileAttached: true,
        },
      },
      {
        associatedJudge: 'Judge Barker',
        document: {
          isFileAttached: true,
        },
      },
      {
        associatedJudge: 'Judge Barker',
        document: {
          isFileAttached: false,
        },
      },
    ];

    presenter.providers.applicationContext = applicationContext;
  });

  it('sets sectionInboxCount for a docketClerk user', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: USER_ROLES.docketClerk,
    });

    const result = await runAction(setSectionInboxCountAction, {
      modules: {
        presenter,
      },
      props: {
        workItems,
      },
      state: {
        judgeUser: undefined,
        workQueueToDisplay: {},
      },
    });
    expect(result.state.sectionInboxCount).toEqual(4);
  });

  it('sets sectionInboxCount for a judge user', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Judge Barker',
      role: USER_ROLES.judge,
    });

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
        workQueueToDisplay: {},
      },
    });
    expect(result.state.sectionInboxCount).toEqual(2);
  });

  it('sets sectionInboxCount for a chambers user', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'ADC',
      role: USER_ROLES.adc,
    });

    const result = await runAction(setSectionInboxCountAction, {
      modules: {
        presenter,
      },
      props: {
        workItems,
      },
      state: {
        workQueueToDisplay: {},
      },
    });
    expect(result.state.sectionInboxCount).toEqual(1);
  });
});
