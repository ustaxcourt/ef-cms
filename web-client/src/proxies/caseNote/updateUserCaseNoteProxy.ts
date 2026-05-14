import { UserCaseNote } from 'shared/src/business/entities/notes/UserCaseNote';
import { put } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const updateUserCaseNoteInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber, notes },
): Promise<UserCaseNote> => {
  return put({
    applicationContext,
    body: { notes },
    endpoint: `/case-notes/${docketNumber}/user-notes`,
  });
};
