import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getPaperServicePdfUrlInteractor = (
  applicationContext: ClientApplicationContext,
  { fileId }: { fileId: string },
): Promise<{ url: string }> => {
  return get({
    applicationContext,
    endpoint: `/trial-sessions/paper-service-pdf/${fileId}`,
  });
};
