import { appInstanceManagerHelper as appInstanceManagerHelperComputed } from './appInstanceManagerHelper';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

describe('appInstanceManagerHelper', () => {
  const appInstanceManagerHelper = withAppContextDecorator(
    appInstanceManagerHelperComputed,
    applicationContext,
  );

  beforeEach(() => {
    applicationContext.getBroadcastGateway.mockResolvedValue(
      'broadcast channel',
    );
  });

  it('returns expected data when state.batchDownloads contains fileCount and totalFiles', () => {
    const result = runCompute(appInstanceManagerHelper);

    expect(result.channelHandle).toEqual('broadcast channel');
  });
});
