import { RawInternalDocumentSearchResult } from '@shared/business/entities/documents/InternalDocumentSearchResult';
import { get } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const orderAdvancedSearchInteractor = (
  applicationContext: ClientApplicationContext,
  { searchParams },
): Promise<{
  results: RawInternalDocumentSearchResult[];
}> => {
  return get({
    applicationContext,
    endpoint: '/case-documents/order-search',
    params: searchParams,
  });
};
