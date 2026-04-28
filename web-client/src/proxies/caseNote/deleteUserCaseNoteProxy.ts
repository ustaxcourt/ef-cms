import { remove } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const deleteUserCaseNoteInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber },
) => {
  return remove({
    applicationContext,
    endpoint: `/case-notes/${docketNumber}/user-notes`,
  });
};
