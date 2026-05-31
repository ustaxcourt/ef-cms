import { RawUserCaseNote } from 'shared/src/business/entities/notes/UserCaseNote';
import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getUserCaseNoteInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber },
): Promise<RawUserCaseNote | undefined> => {
  return get({
    applicationContext,
    endpoint: `/case-notes/${docketNumber}/user-notes`,
  });
};
