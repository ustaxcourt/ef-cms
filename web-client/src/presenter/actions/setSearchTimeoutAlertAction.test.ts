import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { setSearchTimeoutAlertAction } from './setSearchTimeoutAlertAction';

describe('setSearchTimeoutAlertAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('sets alertError to search alert when timeout occurs', async () => {
    const error = {
      message:
        'Please wait a few moments, then click the Search button to retry.',
      title: 'Search is taking too long to respond',
    };
    const { state } = await runAction(setSearchTimeoutAlertAction, {
      modules: { presenter },
      props: { error },
    });
    expect(state.alertError).toEqual(error);
  });
});
