import { get } from './requests';
import { omit } from 'lodash';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const opinionPublicSearchInteractor = (
  applicationContext: ClientApplicationContext,
  { searchParams },
) => {
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
