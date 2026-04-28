import { put } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const saveCaseNoteInteractor = (
  applicationContext: ClientApplicationContext,
  { caseNote, docketNumber },
) => {
  return put({
    applicationContext,
    body: { caseNote },
    endpoint: `/case-notes/${docketNumber}`,
  });
};
