import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setWorkItemAsReadAction } from './setWorkItemAsReadAction';

describe('setWorkItemAsReadAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set message as read', async () => {
    await runAction(setWorkItemAsReadAction, { modules: { presenter } });

    expect(
      applicationContext.getUseCases().setWorkItemAsReadInteractor,
    ).toHaveBeenCalled();
  });
});
