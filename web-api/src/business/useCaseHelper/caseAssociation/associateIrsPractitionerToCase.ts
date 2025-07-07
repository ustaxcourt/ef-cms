import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { Case } from '@shared/business/entities/cases/Case';
import { IrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { RawUser } from '@shared/business/entities/User';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';

export const associateIrsPractitionerToCase = async ({
  applicationContext,
  authorizedUser,
  docketNumber,
  serviceIndicator,
  user,
}: {
  applicationContext: ServerApplicationContext;
  authorizedUser: AuthUser;
  docketNumber: string;
  serviceIndicator?: string;
  user: RawUser;
}): Promise<RawCase> => {
  const [isAssociated, caseToUpdate] = await Promise.all([
    applicationContext.getPersistenceGateway().verifyCaseForUser({
      applicationContext,
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
    return caseEntity.toRawObject();
  }

  caseEntity.attachIrsPractitioner(
    new IrsPractitioner({ ...user, serviceIndicator }),
  );

  return await updateCaseAndAssociations({
    authorizedUser,
    caseToUpdate: caseEntity,
  });
};
