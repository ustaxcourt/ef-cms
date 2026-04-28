import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getUserCaseNoteForCasesInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumbers },
) => {
  return post({
    applicationContext,
    body: docketNumbers,
    endpoint: '/case-notes/batch-cases/user-notes',
  });
};
