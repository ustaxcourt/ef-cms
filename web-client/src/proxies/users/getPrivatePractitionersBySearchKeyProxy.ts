import { RawPrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getPrivatePractitionersBySearchKeyInteractor = (
  applicationContext: ClientApplicationContext,
  { searchKey },
): Promise<RawPrivatePractitioner[]> => {
  return get({
    applicationContext,
    endpoint: `/users/privatePractitioners/search?searchKey=${searchKey}`,
  });
};
