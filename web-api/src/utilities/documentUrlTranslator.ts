import { ServerApplicationContext } from '@web-api/applicationContext';
import { environment } from '@web-api/environment';

export const documentUrlTranslator = ({
  applicationContext,
  documentUrl,
  useTempBucket,
}: {
  applicationContext: ServerApplicationContext;
  documentUrl: string;
  useTempBucket?: boolean;
}): string => {
  if (applicationContext.environment.stage === 'local') {
    return documentUrl;
  }

  const url = new URL(documentUrl);
  const path = useTempBucket ? 'temp-documents' : 'documents';

  url.host = environment.appEndpoint;
  url.pathname = [path, ...url.pathname.split('/').slice(2)].join('/');

  return url.toString();
};
