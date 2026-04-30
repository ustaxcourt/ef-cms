import { RawPublicDocumentSearchResult } from '@shared/business/entities/documents/PublicDocumentSearchResult';
import { RequestApplicationContext, get } from './requests';

export const orderPublicSearchInteractor = (
  applicationContext: RequestApplicationContext,
  { searchParams },
): Promise<{
  results: RawPublicDocumentSearchResult[];
}> => {
  return get({
    applicationContext,
    endpoint: '/public-api/order-search',
    params: searchParams,
  });
};
