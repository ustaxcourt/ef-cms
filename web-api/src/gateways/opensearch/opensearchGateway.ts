import { environment } from '@web-api/environment';
import { sync as sync } from '@web-api/gateways/opensearch/opensearchSync';
import { syncLocal } from '@web-api/gateways/opensearch/opensearchSyncLocal';
import { OpensearchSyncMessage } from '@web-api/gateways/opensearch/opensearchSyncRouter';

export const opensearchGateway = () => ({
  queueSync: ({ message }: { message: OpensearchSyncMessage }) => {
    if (environment.stage === 'local') {
      return syncLocal({ message });
    }
    return sync({ message });
  },
});
