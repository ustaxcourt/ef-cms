import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { Case } from '@shared/business/entities/cases/Case';
import { IrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { RawUser } from '@shared/business/entities/User';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { associateUserWithCase } from '@web-api/persistence/postgres/users/cases/associateUserWithCase';
import { verifyCaseForUser } from '@web-api/persistence/postgres/users/cases/verifyCaseForUser';

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
}): Promise<void> => {
  const isAssociated = await verifyCaseForUser({
    docketNumber,
    userId: user.userId,
  });

  if (!isAssociated) {
    const caseToUpdate = await getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

    await associateUserWithCase({
      docketNumber,
      userId: user.userId,
    });

    const caseEntity = new Case(caseToUpdate, {
      authorizedUser,
    });

    caseEntity.attachIrsPractitioner(
      new IrsPractitioner({ ...user, serviceIndicator }),
    );

    await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
      applicationContext,
      authorizedUser,
      caseToUpdate: caseEntity,
    });
  }
};
