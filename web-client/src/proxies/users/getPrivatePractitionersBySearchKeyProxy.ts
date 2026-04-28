import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getPrivatePractitionersBySearchKeyInteractor = (
  applicationContext: ClientApplicationContext,
  { searchKey },
) => {
  return get({
    applicationContext,
    endpoint: `/users/privatePractitioners/search?searchKey=${searchKey}`,
  });
};
