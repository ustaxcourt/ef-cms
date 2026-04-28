import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getUserCaseNoteInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber },
) => {
  return get({
    applicationContext,
    endpoint: `/case-notes/${docketNumber}/user-notes`,
  });
};
