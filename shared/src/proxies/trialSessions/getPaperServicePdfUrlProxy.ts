import { get } from '../requests';

export const getPaperServicePdfUrlInteractor = (
  applicationContext,
  { key }: { key: string },
): Promise<{ url: string }> => {
  return get({
    applicationContext,
    endpoint: `/trial-sessions/paper-service-pdf/${key}`,
  });
};
