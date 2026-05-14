import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { Case } from '@shared/business/entities/cases/Case';
import { IrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { RawUser } from '@shared/business/entities/User';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { verifyCaseForUser } from '@web-api/persistence/postgres/cases/userOnCase/verifyCaseForUser';

export const associateIrsPractitionerToCase = async ({
  authorizedUser,
  docketNumber,
  serviceIndicator,
  user,
}: {
  authorizedUser: AuthUser;
  docketNumber: string;
  serviceIndicator?: string;
  user: RawUser;
}): Promise<void> => {
  const [isAssociated, caseToUpdate] = await Promise.all([
    verifyCaseForUser({
      docketNumber,
      userId: user.userId,
    }),
    getCaseByDocketNumber({
      docketNumber,
    }),
  ]);

  const caseEntity = new Case(caseToUpdate, {
    authorizedUser,
  });

  if (isAssociated) {
    return;
  }

  caseEntity.attachIrsPractitioner(
    new IrsPractitioner({ ...user, serviceIndicator }),
  );

  await updateCaseAndAssociations({
    authorizedUser,
    caseToUpdate: caseEntity,
  });
};
