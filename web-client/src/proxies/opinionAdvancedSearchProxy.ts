import { get } from './requests';
import { omit } from 'lodash';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { RawInternalDocumentSearchResult } from '@shared/business/entities/documents/InternalDocumentSearchResult';

export const opinionAdvancedSearchInteractor = (
  applicationContext: ClientApplicationContext,
  { searchParams },
): Promise<{
  results: RawInternalDocumentSearchResult[];
}> => {
  const opinionTypesQuery = searchParams.opinionTypes.join(',');

  return get({
    applicationContext,
    endpoint: '/case-documents/opinion-search',
    params: {
      ...omit(searchParams, 'opinionTypes'),
      opinionTypes: opinionTypesQuery,
    },
  });
};
