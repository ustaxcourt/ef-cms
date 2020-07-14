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
        associatedJudge: CHIEF_JUDGE,
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
        workQueueToDisplay: {
          workQueueIsInternal: true,
        },
      },
    });
    expect(result.state.sectionInboxCount).toEqual(3);
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
        workQueueToDisplay: {
          workQueueIsInternal: true,
        },
      },
    });
    expect(result.state.sectionInboxCount).toEqual(1);
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
        workQueueToDisplay: {
          workQueueIsInternal: true,
        },
      },
    });
    expect(result.state.sectionInboxCount).toEqual(1);
  });
});
