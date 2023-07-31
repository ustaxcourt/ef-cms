import { appInstanceManagerHelper as appInstanceManagerHelperComputed } from './appInstanceManagerHelper';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

describe('appInstanceManagerHelper', () => {
  const appInstanceManagerHelper = withAppContextDecorator(
    appInstanceManagerHelperComputed,
    {
      ...applicationContext,
      getBroadcastGateway: jest.fn().mockReturnValue('broadcast channel'),
    },
  );

  it('returns the broadcastChannel instance on the channelHandle property', () => {
    const result = runCompute(appInstanceManagerHelper);

    expect(result.channelHandle).toEqual('broadcast channel');
  });
});
