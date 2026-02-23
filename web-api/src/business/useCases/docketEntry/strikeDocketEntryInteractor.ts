import { Case } from '@shared/business/entities/cases/Case';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';
import { applicationContext } from '@web-api/applicationContext';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
export const strikeDocketEntryInteractor = async (
  {
    docketEntryId,
    docketNumber,
  }: { docketEntryId: string; docketNumber: string },
  authorizedUser: UnknownAuthUser,
): Promise<{ docketNumber: string }> => {
  const hasPermission = isAuthorized(
    authorizedUser,
    ROLE_PERMISSIONS.EDIT_DOCKET_ENTRY,
  );

  if (!hasPermission) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToUpdate = await getCaseByDocketNumber({
    docketNumber,
  });

  let caseEntity = new Case(caseToUpdate, { authorizedUser });

  const docketEntry = caseEntity.getDocketEntryById({
    docketEntryId,
  });

  if (!docketEntry) {
    throw new NotFoundError('Docket entry not found');
  }

  const user = await getUserById({ userId: authorizedUser.userId });

  if (!user) {
    throw new NotFoundError(
      `User not found with user id ${authorizedUser.userId}`,
    );
  }

  docketEntry.strikeEntry({ name: user.name, userId: user.userId });
  docketEntry.pending = false;
  const validatedDocketEntry = docketEntry.validate().toRawObject();
  caseEntity.updateDocketEntry(validatedDocketEntry);

  caseEntity = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAutomaticBlock({
      caseEntity,
    });

  await updateCaseAndAssociations({
    authorizedUser,
    caseToUpdate: caseEntity,
  });

  return { docketNumber };
};
