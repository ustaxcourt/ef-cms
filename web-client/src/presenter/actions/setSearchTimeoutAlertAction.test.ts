import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter';
import { runAction } from '@web-client/presenter/test.cerebral';
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
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const { state } = await runAction(setSearchTimeoutAlertAction, {
      modules: { presenter },
      props: { error },
    });
    expect(state.alertError).toEqual(error);
    expect(consoleErrorSpy).toHaveBeenCalledWith(error);
    consoleErrorSpy.mockRestore();
  });
});
