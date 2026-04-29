import { remove } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';

export const deleteCaseNoteInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber },
): Promise<CaseDTO> => {
  return remove({
    applicationContext,
    endpoint: `/case-notes/${docketNumber}`,
  });
};
