import { RawIrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getIrsPractitionersBySearchKeyInteractor = (
  applicationContext: ClientApplicationContext,
  { searchKey },
): Promise<RawIrsPractitioner[]> => {
  return get({
    applicationContext,
    endpoint: `/users/irsPractitioners/search?searchKey=${searchKey}`,
  });
};
