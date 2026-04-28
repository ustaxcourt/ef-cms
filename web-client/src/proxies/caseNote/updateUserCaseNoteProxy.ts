import { put } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const updateUserCaseNoteInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber, notes },
) => {
  return put({
    applicationContext,
    body: { notes },
    endpoint: `/case-notes/${docketNumber}/user-notes`,
  });
};
