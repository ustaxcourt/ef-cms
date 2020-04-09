import { applicationContextForClient } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { setWorkItemAsReadAction } from './setWorkItemAsReadAction';

describe('setWorkItemAsReadAction', () => {
  const applicationContext = applicationContextForClient;
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
