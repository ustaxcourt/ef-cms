import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setWorkItemsCountAction } from './setWorkItemsCountAction';

describe('setWorkItemsCountAction', () => {
  const state = {
    notifications: {
      qcIndividualInProgressCount: 9,
      qcIndividualInboxCount: 10,
      qcSectionInProgressCount: 8,
      qcSectionInboxCount: 7,
    },
  };

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('sets state.sectionInboxCount from notifications.qcSectionInboxCount', async () => {
    const result = await runAction(setWorkItemsCountAction, {
      modules: {
        presenter,
      },
      state,
    });
    expect(result.state.sectionInboxCount).toEqual(7);
  });

  it('sets state.sectionInProgressCount from notifications.qcSectionInProgressCount', async () => {
    const result = await runAction(setWorkItemsCountAction, {
      modules: {
        presenter,
      },
      state,
    });
    expect(result.state.sectionInProgressCount).toEqual(8);
  });

  it('sets state.individualInboxCount from notifications.qcIndividualInboxCount', async () => {
    const result = await runAction(setWorkItemsCountAction, {
      modules: {
        presenter,
      },
      state,
    });
    expect(result.state.individualInboxCount).toEqual(10);
  });

  it('sets state.individualInProgressCount from notifications.qcIndividualInProgressCount', async () => {
    const result = await runAction(setWorkItemsCountAction, {
      modules: {
        presenter,
      },
      state,
    });
    expect(result.state.individualInProgressCount).toEqual(9);
  });
});
