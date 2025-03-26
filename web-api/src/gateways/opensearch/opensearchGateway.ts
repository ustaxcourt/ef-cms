import { environment } from '@web-api/environment';
import { openSearchSync } from '@web-api/gateways/openSearch/openSearchSync';
import { openSearchSyncLocal } from '@web-api/gateways/openSearch/openSearchSyncLocal';
import { OpenSearchSyncMessage } from '@web-api/gateways/openSearch/openSearchSyncRouter';

export const openSearchGateway = () => ({
  queueSync: ({ message }: { message: OpenSearchSyncMessage }) => {
    if (environment.stage === 'local') {
      return openSearchSyncLocal({ message });
    }
    return openSearchSync({ message });
  },
});
