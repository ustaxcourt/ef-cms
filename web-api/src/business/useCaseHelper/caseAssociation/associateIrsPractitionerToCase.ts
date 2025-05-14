import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { Case } from '@shared/business/entities/cases/Case';
import { IrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { RawUser } from '@shared/business/entities/User';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { verifyCaseForUser } from '@web-api/persistence/postgres/users/cases/verifyCaseForUser';
import { associateUserWithCase } from '@web-api/persistence/postgres/users/cases/associateUserWithCase';

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
    verifyCaseForUser({
      docketNumber,
      userId: user.userId,
    }),
    getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    }),
  ]);

  const caseEntity = new Case(caseToUpdate, {
    authorizedUser,
  });

  if (isAssociated) {
    return caseEntity.toRawObject();
  }

  await associateUserWithCase({
    docketNumber,
    userId: user.userId,
    entityName: IrsPractitioner.ENTITY_NAME,
  });

  caseEntity.attachIrsPractitioner(
    new IrsPractitioner({ ...user, serviceIndicator }),
  );

  return await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      authorizedUser,
      caseToUpdate: caseEntity,
    });
};
