import { get } from '../requests';

export const getPaperServicePdfUrlInteractor = (
  applicationContext,
  { fileId }: { fileId: string },
): Promise<{ url: string }> => {
  return get({
    applicationContext,
    endpoint: `/trial-sessions/paper-service-pdf/${fileId}`,
  });
};
