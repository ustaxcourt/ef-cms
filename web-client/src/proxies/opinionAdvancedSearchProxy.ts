import { get } from './requests';
import { omit } from 'lodash';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const opinionAdvancedSearchInteractor = (
  applicationContext: ClientApplicationContext,
  { searchParams },
) => {
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
