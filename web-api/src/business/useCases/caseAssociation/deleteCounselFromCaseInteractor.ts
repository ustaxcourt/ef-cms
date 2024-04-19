import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { aggregatePartiesForService } from '../../../../../shared/src/business/utilities/aggregatePartiesForService';
import { withLocking } from '@shared/business/useCaseHelper/acquireLock';

export const deleteCounselFromCase = async (
  applicationContext: ServerApplicationContext,
  { docketNumber, userId }: { docketNumber: string; userId: string },
): Promise<void> => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.ASSOCIATE_USER_WITH_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const userToDelete = await applicationContext
    .getPersistenceGateway()
    .getUserById({
      applicationContext,
      userId,
    });

  let caseEntity = new Case(caseToUpdate, { applicationContext });

  if (userToDelete.role === ROLES.privatePractitioner) {
    caseEntity.removePrivatePractitioner(userToDelete);
  } else if (userToDelete.role === ROLES.irsPractitioner) {
    caseEntity.removeIrsPractitioner(userToDelete);
  } else {
    throw new Error('User is not a practitioner');
  }

  caseEntity = setupServiceIndicatorForUnrepresentedPetitioners(caseEntity);

  aggregatePartiesForService(caseEntity);

  await applicationContext.getPersistenceGateway().deleteUserFromCase({
    applicationContext,
    docketNumber,
    userId,
  });

  await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });
};

export const setupServiceIndicatorForUnrepresentedPetitioners = (
  caseEntity: Case,
) => {
  caseEntity.petitioners.forEach(petitioner => {
    if (!Case.isPetitionerRepresented(caseEntity, petitioner.contactId)) {
      petitioner.serviceIndicator = undefined;
    }
  });

  return caseEntity;
};

export const deleteCounselFromCaseInteractor = withLocking(
  deleteCounselFromCase,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
