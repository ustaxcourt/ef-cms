import { environment } from '@web-api/environment';
import { worker } from '@web-api/gateways/opensearch/opensearchWorker';
import { workerLocal } from '@web-api/gateways/opensearch/opensearchWorkerLocal';
import { OpensearchWorkerMessage } from '@web-api/gateways/opensearch/opensearchWorkerRouter';

export const opensearchGateway = () => ({
  queueWork: ({ message }: { message: OpensearchWorkerMessage }) => {
    if (environment.stage === 'local') {
      return workerLocal({ message });
    }
    return worker({ message });
  },
});
