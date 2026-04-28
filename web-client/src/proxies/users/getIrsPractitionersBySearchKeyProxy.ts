import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getIrsPractitionersBySearchKeyInteractor = (
  applicationContext: ClientApplicationContext,
  { searchKey },
) => {
  return get({
    applicationContext,
    endpoint: `/users/irsPractitioners/search?searchKey=${searchKey}`,
  });
};
