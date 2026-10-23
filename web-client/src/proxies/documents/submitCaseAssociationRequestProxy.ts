import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';
import { put } from '../requests';
import { PublicCaseResponse } from '@shared/business/dto/cases/PublicCaseResponse';
import { RestrictedCaseResponse } from '@shared/business/dto/cases/RestrictedCaseResponse';
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
): Promise<
  CaseDTO | PublicCaseResponse | RestrictedCaseResponse | undefined
> => {
  return put({
    applicationContext,
    body: {
      docketNumber,
      filers,
    },
    endpoint: `/users/${userId}/case/${docketNumber}`,
  });
};
