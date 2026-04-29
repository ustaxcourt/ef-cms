import { put } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';

export const saveCaseNoteInteractor = (
  applicationContext: ClientApplicationContext,
  { caseNote, docketNumber },
): Promise<CaseDTO> => {
  return put({
    applicationContext,
    body: { caseNote },
    endpoint: `/case-notes/${docketNumber}`,
  });
};
