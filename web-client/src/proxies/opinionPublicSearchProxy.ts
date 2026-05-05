import { RawPublicDocumentSearchResult } from '@shared/business/entities/documents/PublicDocumentSearchResult';
import { RequestApplicationContext, get } from './requests';
import { omit } from 'lodash';

export const opinionPublicSearchInteractor = (
  applicationContext: RequestApplicationContext,
  { searchParams },
): Promise<{
  results: RawPublicDocumentSearchResult[];
}> => {
  const opinionTypesQuery = searchParams.opinionTypes.join(',');

  return get({
    applicationContext,
    endpoint: '/public-api/opinion-search',
    params: {
      ...omit(searchParams, 'opinionTypes'),
      opinionTypes: opinionTypesQuery,
    },
  });
};
