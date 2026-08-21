import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const addPaperFilingInteractor = (
  applicationContext: ClientApplicationContext,
  data: Record<string, unknown> & {
    documentMetadata: { docketNumber: string };
  },
): Promise<void> => {
  const { documentMetadata } = data;
  const { docketNumber } = documentMetadata;

  return post({
    applicationContext,
    body: data,
    endpoint: `/async/case-documents/${docketNumber}/paper-filing`,
  });
};
