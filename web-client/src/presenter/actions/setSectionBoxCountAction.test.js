import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setSectionBoxCountAction } from './setSectionBoxCountAction';

describe('setSectionBoxCountAction', () => {
  const { CHIEF_JUDGE, USER_ROLES } = applicationContext.getConstants();

  let workItems;

  beforeAll(() => {
    workItems = [
      {
        associatedJudge: 'Judge Barker',
        caseIsInProgress: false,
        document: {
          isFileAttached: true,
        },
      },
      {
        associatedJudge: 'Judge Carey',
        caseIsInProgress: false,
        document: {
          isFileAttached: true,
        },
      },
      {
        associatedJudge: CHIEF_JUDGE,
        caseIsInProgress: false,
        document: {
          isFileAttached: true,
        },
      },
      {
        associatedJudge: 'Judge Barker',
        caseIsInProgress: true,
        document: {
          isFileAttached: true,
        },
      },
      {
        associatedJudge: 'Judge Barker',
        caseIsInProgress: false,
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

    const result = await runAction(setSectionBoxCountAction, {
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
    expect(result.state.sectionInboxCount).toEqual(3);
  });

  it('sets sectionInProgressCount for a docketClerk user', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: USER_ROLES.docketClerk,
    });

    const result = await runAction(setSectionBoxCountAction, {
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
    expect(result.state.sectionInProgressCount).toEqual(1);
  });

  it('sets sectionInboxCount for a judge user', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Judge Barker',
      role: USER_ROLES.judge,
    });

    const result = await runAction(setSectionBoxCountAction, {
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
    expect(result.state.sectionInboxCount).toEqual(1);
  });

  it('sets sectionInboxCount for a chambers user', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'ADC',
      role: USER_ROLES.adc,
    });

    const result = await runAction(setSectionBoxCountAction, {
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
