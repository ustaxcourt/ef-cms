import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';
import { put } from '../requests';
import { PublicCaseDTO } from '@shared/business/dto/cases/PublicCaseDTO';
import { RestrictedCaseDTO } from '@shared/business/dto/cases/RestrictedCaseDTO';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const submitCaseAssociationRequestInteractor = (
  applicationContext: ClientApplicationContext,
  {
    docketNumber,
    filers,
    userId,
  }: {
    docketNumber: string;
    userId: string;
    filers?: string[];
  },
): Promise<CaseDTO | PublicCaseDTO | RestrictedCaseDTO> => {
  return put({
    applicationContext,
    body: {
      docketNumber,
      filers,
    },
    endpoint: `/users/${userId}/case/${docketNumber}`,
  });
};
