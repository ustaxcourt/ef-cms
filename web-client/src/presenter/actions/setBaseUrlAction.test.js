import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setBaseUrlAction } from './setBaseUrlAction';

describe('setBaseUrlAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('sets state.baseUrl from applicationContext', async () => {
    const { state } = await runAction(setBaseUrlAction, {
      modules: {
        presenter,
      },
    });

    expect(state.baseUrl).toEqual(applicationContext.getBaseUrl());
  });
});
