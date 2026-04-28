import { remove } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const deleteCaseNoteInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber },
) => {
  return remove({
    applicationContext,
    endpoint: `/case-notes/${docketNumber}`,
  });
};
