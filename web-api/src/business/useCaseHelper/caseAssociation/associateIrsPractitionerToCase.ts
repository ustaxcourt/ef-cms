import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { Case } from '@shared/business/entities/cases/Case';
import { IrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { RawUser } from '@shared/business/entities/User';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UserCase } from '@shared/business/entities/UserCase';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';

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

  const userCaseEntity = new UserCase(caseToUpdate);

  await applicationContext.getPersistenceGateway().associateUserWithCase({
    applicationContext,
    docketNumber,
    userCase: userCaseEntity.validate().toRawObject(),
    userId: user.userId,
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
